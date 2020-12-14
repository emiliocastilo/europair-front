import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss'],
})
export class AircraftListComponent implements OnInit {
  @ViewChild(AircraftDetailComponent, { static: true, read: ElementRef })
  public aircraftDetailModal: ElementRef;
  @ViewChild('confirmDeleteModal', { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild('confirmMultipleDeleteModal', { static: true, read: ElementRef })
  public confirmMultipleDeleteModal: ElementRef;

  public readonly pageTitle = 'FLEET.AIRCRAFTS.PAGE_TITLE';

  public aircraftSelected: Aircraft = EMPTY_AIRCRAFT;

  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'FLEET.AIRCRAFTS.NEW' },
    { type: BarButtonType.DELETE_SELECTED, text: 'FLEET.AIRCRAFTS.DELETE' },
  ];

  public aircraftColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftColumnsData: RowDataModel[] = [];
  public aircraftColumnsPagination: PaginationModel;

  public aircraftDetailTitle: string;
  public aircraftList: Aircraft[] = [];
  public selectedItems: number[] = [];
  private operatorFilter = {};

  public aircraftBaseColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftBaseColumnsData: RowDataModel[] = [];
  public aircraftBaseColumnsPagination: PaginationModel;

  public aircraftObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftObservationsColumnsData: RowDataModel[] = [];
  public aircraftObservationsColumnsPagination: PaginationModel;
  public translationParams = {};

  private barButtonActions = { 
    new: this.newAircraft,
    delete_selected: this.deleteSelectedOperators
   };

  private aircraftTableActions = {
    edit: this.editAircraft,
    delete: this.deleteAircraft,
  };

  public aircraftAdvancedSearchForm = this.fb.group({
    'filter_operator.name': [''],
    'filter_aircraftType.code': [''],
    'filter_aircraftType.category.code': [''],
    'filter_aircraftType.subcategory.code': [''],
    filter_plateNumber: [''],
    filter_productionYear: [''],
    filter_insideUpgradeYear: [''],
    filter_quantity: [''],
    'filter_bases.airport.id': [''],
    'filter_operator.id': [''],
    'filter_bases.airport.iataCode': [''],
    filter_removedAt: [null],
  });
  public aircraftSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private modalService: ModalService,
    private aircraftService: AircraftService,
    private aircraftTableAdapter: AircraftTableAdapterService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.filterAircraftTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.aircraftColumnsHeader = this.aircraftTableAdapter.getAircraftColumnsHeader();
    this.aircraftBaseColumnsHeader = this.aircraftTableAdapter.getAircraftBaseColumnsHeader();
    this.aircraftObservationsColumnsHeader = this.aircraftTableAdapter.getAircraftObservationsColumnsHeader();
  }

  private initializeAircraftTable(searchFilter?: SearchFilter) {
    console.log('FILTER', searchFilter);
    this.aircraftService.getAircraft(searchFilter).subscribe(
      (aircraftPage: Page<Aircraft>) =>  this.getAircraftTableData(aircraftPage)
    );
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

  private deleteSelectedOperators(): void {
    this.initializeModal(this.confirmMultipleDeleteModal);
    this.modalService.openModal();
  }

  private editAircraft(selectedItem: number): void {
    this.router.navigate([
      'fleet/aircraft',
      this.aircraftList[selectedItem].id,
    ]);
  }

  private deleteAircraft(selectedItem: number) {
    this.translationParams = {aircraft: this.aircraftList[selectedItem]?.plateNumber};
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType].bind(this)();
  }

  public onAircraftsSelected(selectedItems: number[]) {
    this.selectedItems = selectedItems;
  }

  public onFilterAircrafts(airportFilter: ColumnFilter) {
    console.log(airportFilter);
    this.operatorFilter[airportFilter.identifier] = airportFilter.searchTerm;
    this.filterAircraftTable();
  }

  public onSortAircrafts(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.aircraftSortForm.patchValue({ sort: sort });
    this.filterAircraftTable();
  }


  public onAircraftAction(action: { actionId: string; selectedItem: number }) {
    this.aircraftSelected = { ...this.aircraftList[action.selectedItem] };
    this.aircraftTableActions[action.actionId].bind(this)(action.selectedItem);
  }

  public onConfirmDeleteAircraft() {
    this.aircraftService
      .removeAircraft(this.aircraftSelected)
      .subscribe((_) => this.filterAircraftTable());
  }

  public onConfirmDeleteMultipleOperators() {
    console.log('DELETING AIRCRAFT ', this.selectedItems.map(item => this.aircraftList[item].id));
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.aircraftTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }

  private filterAircraftTable(): void {
    this.updateOperatorFilterRouteQueryParams();
    this.aircraftAdvancedSearchForm.patchValue(this.operatorFilter);
    const filter = {
      ...this.aircraftAdvancedSearchForm.value,
      ...this.aircraftSortForm.value
    };
    this.initializeAircraftTable(filter);
  }

  private updateOperatorFilterRouteQueryParams() {
    const {airportId, operatorId, aircrftCode} = this.route.snapshot.queryParams;
    this.operatorFilter['filter_bases.airport.id'] = airportId ?? '';
    this.operatorFilter['filter_operator.id'] = operatorId ?? '';
    this.operatorFilter['filter_aircraftType.code'] = aircrftCode ?? this.getDefaultValue(this.operatorFilter['filter_aircraftType.code']);
  }

  private getDefaultValue(value: string) {
    return value ?? '';
  }
}
