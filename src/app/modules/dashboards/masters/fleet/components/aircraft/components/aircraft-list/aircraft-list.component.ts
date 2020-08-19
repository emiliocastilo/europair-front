import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButtonType,
  BarButton,
} from 'src/app/core/models/menus/button-bar/bar-button';
import {
  EMPTY_AIRCRAFT,
  Aircraft,
  AircraftBase,
} from '../../models/Aircraft.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { AircraftTableAdapterService } from '../../services/aircraft-table-adapter.service';
import { AircraftService } from '../../services/aircraft.service';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { AircraftDetailComponent } from '../aircraft-detail/aircraft-detail.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss'],
})
export class AircraftListComponent implements OnInit {
  @ViewChild(AircraftDetailComponent, { static: true, read: ElementRef })
  public aircraftDetailModal: ElementRef;

  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public readonly pageTitle = 'Aeronaves';

  public aircraftSelected: Aircraft = EMPTY_AIRCRAFT;
  public aircraftSelectedCount = 0;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva aeronave' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];

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
    edit: this.editAircraft,
    delete: this.deleteAircraft,
  };

  constructor(
    private modalService: ModalService,
    private aircraftService: AircraftService,
    private aircraftTableAdapter: AircraftTableAdapterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAircraftTable();
    this.initializeTablesColumnsHeader();
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

  private newAircraft(): void {
    this.router.navigate(['fleet/aircraft', 'new']);
  }

  private editAircraft(selectedItem: number): void {
    this.router.navigate(['fleet/aircraft', this.aircraftList[selectedItem].id]);
  }

  private deleteAircraft(selectedItem: number) {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
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

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.aircraftTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
