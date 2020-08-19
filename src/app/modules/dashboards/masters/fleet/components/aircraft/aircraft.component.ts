import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { AircraftDetailComponent } from './components/aircraft-detail/aircraft-detail.component';
import { Aircraft, AircraftBase, EMPTY_AIRCRAFT } from './models/Aircraft.model';
import { AircraftTableAdapterService } from './services/aircraft-table-adapter.service';
import { AircraftService } from './services/aircraft.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

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

  public aircraftSelected: Aircraft = EMPTY_AIRCRAFT;
  public aircraftSelectedCount = 0;

  public barButtons: BarButton[];

  public aircraftColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftColumnsData: RowDataModel[] = [];
  public aircraftColumnsPagination: PaginationModel;

  public aircraftDetailTitle: string;
  public aircraftList: Aircraft[] = [];

  public aircraftBaseColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftBaseColumnsData: RowDataModel[] = [];
  public aircraftBaseColumnsPagination: PaginationModel;

  public aircraftObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftObservationsColumnsData: RowDataModel[] = [];
  public aircraftObservationsColumnsPagination: PaginationModel;

  private barButtonActions = { new: this.newAircraft };
  private aircraftTableActions = {
    view: this.viewAircraft,
    edit: this.editAircraft,
    delete: this.deleteAircraft,
  };

  public aircraftForm = this.fb.group({
    operator: [''],
    quantity: ['', Validators.required],
    aircraftType: [''],
    insuranceEndDate: ['', Validators.required],
    productionYear: ['', Validators.required],
    plateNumber: ['', Validators.required],
    ambulance: [''],
    bases: [''],
    daytimeConfiguration: ['', Validators.required],
    nighttimeConfiguration: ['', Validators.required],
    insideUpgradeDate: ['', Validators.required],
    outsideUpgradeDate: ['', Validators.required],
    observations: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private aircraftService: AircraftService,
    private aircraftTableAdapter: AircraftTableAdapterService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeAircraftTable();
    this.initializeTablesColumnsHeader();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newAircraft: this.translateService.get('FLEET.AIRCRAFTS.NEW'),
      deleteAircraft: this.translateService.get('FLEET.AIRCRAFTS.DELETE')
    }).subscribe((data: { newAircraft: string, deleteAircraft: string }) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newAircraft },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteAircraft },
      ];
    });
  }

  private initializeTablesColumnsHeader() {
    this.aircraftColumnsHeader = this.aircraftTableAdapter.getAircraftColumnsHeader();
    this.aircraftBaseColumnsHeader = this.aircraftTableAdapter.getAircraftBaseColumnsHeader();
    this.aircraftObservationsColumnsHeader = this.aircraftTableAdapter.getAircraftObservationsColumnsHeader();
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
    this.aircraftBaseColumnsData = this.getAircraftBaseTableDataForAircraft(
      aircraftSelected,
      [], // data.bases.content,
      editable
    );
    this.aircraftBaseColumnsPagination = this.initializeClientTablePagination(
      this.aircraftBaseColumnsData
    );

    this.aircraftObservationsColumnsData = this.getAircraftObservationsTableDataForAircraft(
      aircraftSelected,
      [], // data.observations.content,
      editable
    );
    this.aircraftObservationsColumnsPagination = this.initializeClientTablePagination(
      this.aircraftObservationsColumnsData
    );

    this.aircraftDetailTitle = aircraftDetailTitle;
    this.initializeModal(this.aircraftDetailModal);
    this.modalService.openModal();
  }

  private getAircraftBaseTableDataForAircraft(
    aircraft: Aircraft,
    bases: AircraftBase[] = [],
    editable = true
  ): RowDataModel[] {
    const aircraftBases = aircraft ? aircraft.bases : [];
    return this.aircraftTableAdapter.getAircraftBaseTableData(
      bases,
      aircraftBases,
      'assigned-base-',
      editable
    );
  }

  private getAircraftObservationsTableDataForAircraft(
    aircraft: Aircraft,
    observations: any[] = [],
    editable = true
  ): RowDataModel[] {
    const aircraftObservations = aircraft ? aircraft.observations : [];
    return this.aircraftTableAdapter.getAircraftObservationsTableData(
      observations,
      aircraftObservations,
      'assigned-base-',
      editable
    );
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
      this.translateService.instant('FLEET.AIRCRAFTS.VIEW_AIRCRAFT'),
      this.aircraftSelected,
      false
    );
  }

  private updateAircraftForm(selectedAircraft: Aircraft) {
    this.aircraftForm.setValue({
      operator: selectedAircraft.operator,
      quantity: selectedAircraft.quantity,
      aircraftType: selectedAircraft.aircraftType,
      insuranceEndDate: selectedAircraft.insuranceEndDate,
      productionYear: selectedAircraft.productionYear,
      plateNumber: selectedAircraft.plateNumber,
      ambulance: selectedAircraft.ambulance,
      bases: selectedAircraft.bases || [],
      daytimeConfiguration: selectedAircraft.daytimeConfiguration,
      nighttimeConfiguration: selectedAircraft.nighttimeConfiguration,
      observations: selectedAircraft.observations || [],
      insideUpgradeDate: selectedAircraft.insideUpgradeDate,
      outsideUpgradeDate: selectedAircraft.outsideUpgradeDate,
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
      this.translateService.instant('FLEET.AIRCRAFTS.EDIT_AIRCRAFT'),
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
      this.translateService.instant('FLEET.AIRCRAFTS.NEW_AIRCRAFT'),
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

  public onSaveAircraft(newAircraft: Aircraft) {
    // TODO: utilizar datepickers para las propiedades que son fechas
    newAircraft.insuranceEndDate = new Date(newAircraft.insuranceEndDate);
    newAircraft.insideUpgradeDate = new Date(newAircraft.insideUpgradeDate);
    newAircraft.outsideUpgradeDate = new Date(newAircraft.outsideUpgradeDate);
    // TODO: enlazar con operadores y tipos
    newAircraft.operator = 10;
    newAircraft.aircraftType = 10;

    this.aircraftService
      .saveAircraft(newAircraft)
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
