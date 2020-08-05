import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { AircraftDetailComponent } from './components/aircraft-detail/aircraft-detail.component';
import { Aircraft, EMPTY_AIRCRAFT } from './models/Aircraft.model';
import { AircraftTableAdapterService } from './services/aircraft-table-adapter.service';
import { AircraftService } from './services/aircraft.service';

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss'],
  providers: [AircraftTableAdapterService],
})
export class AircraftComponent implements OnInit {
  @ViewChild(AircraftDetailComponent, { static: true, read: ElementRef })
  public aircraftDetailModal: ElementRef;

  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public readonly pageTitle = 'Aeronaves';
  private readonly VIEW_AIRCRAFT_TITLE = 'Detalle aeronave';
  private readonly EDIT_AIRCRAFT_TITLE = 'Editar aeronave';
  private readonly CREATE_AIRCRAFT_TITLE = 'Crear aeronave';

  public aircraftSelected: Aircraft = EMPTY_AIRCRAFT;
  public aircraftSelectedCount = 0;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva aeronave' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];

  public aircraftColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftColumnsData: RowDataModel[] = [];
  public aircraftColumnsPagination: PaginationModel;

  public aircraftDetailTitle: string;
  public aircraftList: Aircraft[] = [];

  // public aircraftRoleColumnsHeader: ColumnHeaderModel[] = [];
  // public aircraftRoleColumnsData: RowDataModel[] = [];

  // public aircraftTaskColumnsHeader: ColumnHeaderModel[] = [];
  // public aircraftTaskColumnsData: RowDataModel[] = [];

  private barButtonActions = { new: this.newAircraft };
  private aircraftTableActions = {
    view: this.viewAircraft,
    edit: this.editAircraft,
    delete: this.deleteAircraft,
  };

  public aircraftForm = this.fb.group({
    // iata: ['', Validators.required],
    // icao: ['', Validators.required],
    // name: ['', Validators.required],
    // aocRevision: ['', Validators.required],
    // aocNumber: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private aircraftService: AircraftService,
    private aircraftTableAdapter: AircraftTableAdapterService
  ) {}

  ngOnInit(): void {
    this.initializeAircraftTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.aircraftColumnsHeader = this.aircraftTableAdapter.getAircraftColumnsHeader();
  }

  private initializeAircraftTable() {
    this.aircraftService.getAircraft().subscribe((aircraftPage) => {
      this.getAircraftTableData(aircraftPage);
    });
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private getAircraftTableData(aircraftPage: Page<Aircraft>) {
    this.aircraftList = aircraftPage.content;
    this.aircraftColumnsData = this.aircraftTableAdapter.getAircraftTableDataFromAircraft(
      aircraftPage.content
    );
    this.aircraftColumnsPagination = this.initializeClientTablePagination(
      this.aircraftColumnsData
    );
  }

  private getAircraftDetailData(
    data: any,
    aircraftDetailTitle: string,
    aircraftSelected: Aircraft,
    editable = true
  ) {
    // this.userRoleColumnsData = this.getUserRoleTableDataForUser(
    //   userSelected,
    //   data.roles.content,
    //   editable
    // );
    // this.userRoleColumnsPagination = this.initializeClientTablePagination(
    //   this.userRoleColumnsData
    // );
    // this.userTaskColumnsData = this.getUserTaskTableDataForUser(
    //   userSelected,
    //   data.tasks.content,
    //   editable
    // );
    // this.userTaskColumnsPagination = this.initializeClientTablePagination(
    //   this.userTaskColumnsData
    // );
    this.aircraftDetailTitle = aircraftDetailTitle;
    this.initializeModal(this.aircraftDetailModal);
    this.modalService.openModal();
  }

  private viewAircraft(selectedItem: number) {
    // this.getTasksAndRoles$().subscribe(this.getViewUserDetailData);
    this.getViewAircraftDetailData(null);
  }

  private getViewAircraftDetailData(data: any) {
    this.updateAircraftForm(this.aircraftSelected);
    this.aircraftForm.disable();
    this.getAircraftDetailData(
      data,
      this.VIEW_AIRCRAFT_TITLE,
      this.aircraftSelected,
      false
    );
  }

  private updateAircraftForm(selectedAircraft: Aircraft) {
    this.aircraftForm.setValue({
      // iata: selectedAircraft.iata,
      // icao: selectedAircraft.icao,
      // name: selectedAircraft.name,
      // aocRevision: selectedAircraft.aocRevision,
      // aocNumber: selectedAircraft.aocNumber,
    });
  }

  private editAircraft(selectedItem: number) {
    // this.getTasksAndRoles$().subscribe(this.getEditUserDetailData);
    this.getEditAircraftDetailData(null);
  }

  private getEditAircraftDetailData(data: any) {
    this.updateAircraftForm(this.aircraftSelected);
    this.aircraftForm.enable();
    this.getAircraftDetailData(
      data,
      this.EDIT_AIRCRAFT_TITLE,
      this.aircraftSelected
    );
  }

  private deleteAircraft(selectedItem: number) {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  private newAircraft() {
    // this.getTasksAndRoles$().subscribe(this.getNewUserDetailData);
    this.getNewAircraftDetailData(null);
  }

  private getNewAircraftDetailData(data: any) {
    this.aircraftSelected = { ...EMPTY_AIRCRAFT };
    this.aircraftForm.enable();
    this.aircraftForm.reset();
    this.getAircraftDetailData(
      data,
      this.CREATE_AIRCRAFT_TITLE,
      EMPTY_AIRCRAFT
    );
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType].bind(this)();
  }

  public onAircraftSelected(selectedIndex: number) {
    // console.log('onAircraftSelected', selectedIndex);
  }

  public onAircraftAction(action: { actionId: string; selectedItem: number }) {
    this.aircraftSelected = { ...this.aircraftList[action.selectedItem] };
    this.aircraftTableActions[action.actionId].bind(this)(action.selectedItem);
  }

  public onConfirmDeleteAircraft() {
    this.aircraftService
      .removeAircraft(this.aircraftSelected)
      .subscribe((_) => this.initializeAircraftTable());
  }

  public onSaveAircraft(newUAircraft: Aircraft) {
    this.aircraftService
      .saveAircraft(newUAircraft)
      .subscribe(() => this.initializeAircraftTable());
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.aircraftTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
