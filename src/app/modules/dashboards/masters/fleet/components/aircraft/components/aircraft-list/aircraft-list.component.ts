import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { Aircraft, EMPTY_AIRCRAFT } from '../../models/Aircraft.model';
import { AircraftTableAdapterService } from '../../services/aircraft-table-adapter.service';
import { AircraftService } from '../../services/aircraft.service';
import { AircraftDetailComponent } from '../aircraft-detail/aircraft-detail.component';

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

  private newAircraft(): void {
    this.router.navigate(['fleet/aircraft', 'new']);
  }

  private editAircraft(selectedItem: number): void {
    this.router.navigate([
      'fleet/aircraft',
      this.aircraftList[selectedItem].id,
    ]);
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
