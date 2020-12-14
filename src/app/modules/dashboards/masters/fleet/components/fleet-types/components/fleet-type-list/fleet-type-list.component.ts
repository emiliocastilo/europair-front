import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FleetType } from '../../../../models/fleet';
import { Observable } from 'rxjs';
import {
  BarButtonType,
  BarButton,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { FleetTypesService } from '../../services/fleet-types.service';
import { FleetTypesTableAdapterService } from '../../services/fleet-types-table-adapter.service';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { Router } from '@angular/router';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-fleet-type-list',
  templateUrl: './fleet-type-list.component.html',
  styleUrls: ['./fleet-type-list.component.scss'],
})
export class FleetTypeListComponent implements OnInit {
  @ViewChild('deleteTypeModal', { static: true, read: ElementRef })
  private readonly confirmDeleteTypeModal: ElementRef;
  @ViewChild('deleteMultipleTypesModal', { static: true, read: ElementRef })
  private readonly confirmDeleteMultipleTypesModal: ElementRef;

  public pageTitle = 'FLEET.TYPES.PAGE_TITLE';
  public typesColumnsHeader: Array<ColumnHeaderModel>;
  public typesColumnsData: Array<RowDataModel>;
  public typeDetailColumnsData: Array<RowDataModel>;
  public typePagination: PaginationModel;
  public typesBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'FLEET.TYPES.NEW' },
    { type: BarButtonType.DELETE_SELECTED, text: 'FLEET.TYPES.DELETE' },
  ];
  public selectedType: number;
  public selectedTypes: number[] = [];
  private typeFilter = {};
  public translationParams = {};

  public types: Array<FleetType>;
  private readonly barButtonTypeActions = {
    new: this.newType.bind(this),
    delete_selected: this.deleteSelectedTypes.bind(this),
    view: this.viewFleet.bind(this),
  };
  private readonly typeTableActions = {
    edit: this.editType.bind(this),
    delete: this.deleteType.bind(this),
  };
  public typeAdvancedSearchForm = this.fb.group({
    filter_code: [''],
    filter_description: [''],
    filter_iataCode: [''],
    filter_icaoCode: [''],
    'filter_category.name': [''],
    'filter_subcategory.name': [''],
    filter_flightRange: [''],
    filter_removedAt: [null],
  });
  public typeSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly typeService: FleetTypesService,
    private readonly fleetTypesTableAdapterService: FleetTypesTableAdapterService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeTypeTable();
  }

  private initializeTypeTable(): void {
    this.typesColumnsHeader = this.fleetTypesTableAdapterService.getFleetTypeColumnsHeader();
    this.filterTypeTable();
  }

  private obtainTypes(searchFilter?: SearchFilter) {
    this.typeService
      .getFleetTypes(searchFilter)
      .subscribe((data: Page<FleetType>) => {
        this.types = data.content;
        this.typesColumnsData = this.fleetTypesTableAdapterService.getFleetTypes(
          this.types
        );
        this.typePagination = this.fleetTypesTableAdapterService.getPagination();
        this.typePagination.lastPage =  this.types.length / this.typePagination.elementsPerPage;
      });
  }

  public checkShowDisabled(showDisabled: boolean): void {
    if (showDisabled) {
      this.typeFilter['filter_removedAt'] = '';
    } else {
      this.typeFilter['filter_removedAt'] = null;
    }
    this.filterTypeTable();
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onFilterTypes(categoryFilter: ColumnFilter): void {
    this.typeFilter[categoryFilter.identifier] = categoryFilter.searchTerm;
    this.filterTypeTable();
  }

  public onSortTypes(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.typeSortForm.patchValue({ sort: sort });
    this.filterTypeTable();
  } 

  public onTypesSelected(selectedTypes: number[]): void {
    this.selectedTypes = selectedTypes;
  }

  public onTypeAction(action: {
    actionId: string;
    selectedItem: number;
  }): void {
    this.typeTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonTypesClicked(barButtonType: BarButtonType): void {
    this.barButtonTypeActions[barButtonType]();
  }

  private newType(): void {
    this.router.navigate(['fleet/types', 'new']);
  }

  private deleteSelectedTypes(): void {
    this.initializeModal(this.confirmDeleteMultipleTypesModal);
    this.modalService.openModal();
  }

  private viewFleet(): void {
    const itemSelectedIdex: number = this.selectedTypes[0];
    this.router.navigate(['fleet/aircraft'], { queryParams: { aircrftCode: this.types[itemSelectedIdex].code} });
  }

  private editType(selectedItem: number): void {
    const typeId = this.types[selectedItem]?.id;
    if (typeId) {
      this.router.navigate(['fleet/types', typeId]);
    }
  }

  private deleteType(selectedItem: number): void {
    this.selectedType = selectedItem;
    this.translationParams = {type: this.types[selectedItem]?.code};
    this.initializeModal(this.confirmDeleteTypeModal);
    this.modalService.openModal();
  }

  public onSaveType(type: FleetType): void {
    const saveType: Observable<FleetType> =
      type.id === undefined
        ? this.typeService.addFleetType(type)
        : this.typeService.editFleetType(type);
    saveType.subscribe(() => this.filterTypeTable());
  }

  public onConfirmDeleteType(): void {
    this.typeService
      .deleteFleetType(this.types[this.selectedType])
      .subscribe(() => {
        this.filterTypeTable();
      });
  }

  public onConfirmDeleteMultipleType() {
    console.log('DELETING TYPES ', this.selectedTypes.map(item => this.types[item].id));
  }

  private filterTypeTable(): void {
    this.typeAdvancedSearchForm.patchValue(this.typeFilter);
    const filter = {
      ...this.typeAdvancedSearchForm.value,
      ...this.typeSortForm.value,
      size: '30000'
    };
    this.obtainTypes(filter);
  }
}
