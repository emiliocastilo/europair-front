import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { FleetType, EMPTY_FLEET_TYPE } from '../../models/fleet';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { FleetTypesService } from './services/fleet-types.service';
import { FleetTypesTableAdapterService } from './services/fleet-types-table-adapter.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Observable } from 'rxjs';
import { FleetTypeDetailComponent } from './components/fleet-type-detail/fleet-type-detail.component';

@Component({
  selector: 'app-fleet-types',
  templateUrl: './fleet-types.component.html',
  styleUrls: ['./fleet-types.component.scss']
})
export class FleetTypesComponent implements OnInit {
  @ViewChild(FleetTypeDetailComponent, { static: true, read: ElementRef })
  private readonly typeDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmDeleteTypeModal: ElementRef;

  private readonly EDIT_TYPE_TITLE = 'Editar Tipo';
  private readonly CREATE_TYPE_TITLE = 'Crear Tipo';

  public pageTitle = 'Tipos';
  public userData = { userName: 'Usuario', userRole: 'Administrador' };
  public typesColumnsHeader: Array<ColumnHeaderModel>;
  public typesColumnsData: Array<RowDataModel>;
  public typesSelectedCount = 0;
  public typeDetailColumnsData: Array<RowDataModel>;
  public typePagination: PaginationModel;
  public typesBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo Tipo' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  public typeDetailTitle: string;
  public typeSelected: FleetType = EMPTY_FLEET_TYPE;
  public selectedType: number;

  private showDisabled: boolean;
  private types: Array<FleetType>;
  private readonly barButtonTypeActions = { 
    new: this.newType.bind(this),
    view: this.viewFleet.bind(this)
  };
  private readonly typeTableActions = {
    edit: this.editType.bind(this),
    delete: this.deleteType.bind(this)
  };

  constructor(
    private readonly modalService: ModalService,
    private readonly typeService: FleetTypesService,
    private readonly fleetTypesTableAdapterService: FleetTypesTableAdapterService
  ) { }

  ngOnInit(): void {
    this.initializeTypeTable();
  }

  private initializeTypeTable(): void {
    this.showDisabled = true;
    this.typesColumnsHeader = this.fleetTypesTableAdapterService.getFleetTypeColumnsHeader();
    this.obtainTypes();
  }

  private obtainTypes() {
    this.typeService.getFleetTypes(this.showDisabled).subscribe((data: Page<FleetType>) => {
      this.types = data.content;
      this.typesColumnsData = this.fleetTypesTableAdapterService.getFleetTypes(this.types);
      this.typePagination = this.fleetTypesTableAdapterService.getPagination();
      this.typePagination.lastPage = Math.floor(this.types.length / this.typePagination.elememtsPerpage);
    });
  }

  public showSubtypesTable(): boolean {
    return this.selectedType !== undefined;
  }

  public checkShowDisabled(showDisabled: boolean): void {
    this.showDisabled = showDisabled;
    this.obtainTypes();
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onTypeSelected(selectedIndex: number): void {
    this.selectedType = selectedIndex;
  }

  public onTypeAction(action: { actionId: string; selectedItem: number }): void {
    this.typeTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonTypesClicked(barButtonType: BarButtonType): void {
    this.barButtonTypeActions[barButtonType]();
  }

  private newType(): void {
    this.typeDetailTitle = this.CREATE_TYPE_TITLE;
    this.initializeTypeDetailModal(this.CREATE_TYPE_TITLE, { ...EMPTY_FLEET_TYPE });
    this.modalService.openModal();
  }

  private viewFleet(): void {
    console.log('redirect to list fleet');
    console.log(this.types[this.selectedType]);
  }

  private editType(selectedItem: number): void {
    this.initializeTypeDetailModal(this.EDIT_TYPE_TITLE, {
      ...this.types[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteType(selectedItem: number): void {
    this.selectedType = selectedItem;
    this.initializeModal(this.confirmDeleteTypeModal);
    this.modalService.openModal();
  }

  private initializeTypeDetailModal(typeDetailTitle: string, typeSelected: FleetType): void {
    this.typeDetailTitle = typeDetailTitle;
    this.typeSelected = typeSelected;
    this.initializeModal(this.typeDetailModal);
  }

  public onSaveType(type: FleetType): void {
    const saveType: Observable<FleetType> = type.id === undefined ? this.typeService.addFleetType(type) : this.typeService.editFleetType(type);
    saveType.subscribe(() => this.obtainTypes());
  }

  public onConfirmDeleteType(): void {
    this.typeService.deleteFleetType(this.types[this.selectedType]).subscribe(() => {
      this.initializeTypeTable();
    });
  }
}
