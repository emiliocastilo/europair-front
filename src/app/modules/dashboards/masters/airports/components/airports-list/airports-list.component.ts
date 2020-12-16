import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportsService } from '../../services/airports.service';
import { AirportsTableAdapterService } from '../../services/airports-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../../models/airport';
import { Router } from '@angular/router';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';

@Component({
  selector: 'app-airports-list',
  templateUrl: './airports-list.component.html',
  styleUrls: ['./airports-list.component.scss']
})
export class AirportsListComponent implements OnInit {

  constructor(
    private readonly modalService: ModalService,
    private readonly airportsService: AirportsService,
    private readonly airportsTableAdapterService: AirportsTableAdapterService,
    private readonly router: Router,
    private fb: FormBuilder,
  ) { }

  @ViewChild('confirmMultipleDisableModal', { static: true, read: ElementRef })
  private readonly confirmMultipleDisableModal: ElementRef;
  @ViewChild('confirmDisableModal', { static: true, read: ElementRef })
  private readonly confirmDisableModal: ElementRef;

  public readonly pageTitle = 'AIRPORTS.PAGE_TITLE';
  public airportColumnsHeader: Array<ColumnHeaderModel>;
  public airportsColumnsData: Array<RowDataModel>;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'AIRPORTS.NEW' },
    { type: BarButtonType.DELETE_SELECTED, text: 'AIRPORTS.DISABLE' },
    { type: BarButtonType.SEARCH, text: '' },
  ];
  public airportPagination: PaginationModel;
  public airportDetailTitle: string;

  private selectedItem: number;
  public selectedItems: number[] = [];
  public airports: Array<Airport>;
  private airportFilter: any = { page: 0 };
  public translationParams = {};

  private currentPage: number = 0;

  public airportAdvancedSearchForm = this.fb.group({
    filter_iataCode: [''],
    filter_icaoCode: [''],
    filter_name: [''],
    'filter_city.name': [''],
    'filter_country.name': [''],
    filter_removedAt: [null],
    search: ['']
  });
  public airportSortForm = this.fb.group({
    sort: [''],
  });

  private readonly barButtonActions = {
    new: this.newAirport.bind(this),
    delete_selected: this.disableSelectedAirports.bind(this),
  };
  private readonly airportTableActions = {
    edit: this.editAirport.bind(this),
    disable: this.disableAirport.bind(this)
  };

  ngOnInit(): void {
    this.airportColumnsHeader = this.airportsTableAdapterService.getAirportListColumnsHeader();
    this.filterAirportTable();
  }

  private obtainAirportsTable(searchFilter?: SearchFilter): void {
    this.airportsService.getAirports(searchFilter).subscribe((page: Page<Airport>) => {
      this.airports = page.content;
      this.airportsColumnsData = this.airportsTableAdapterService.getAirportListTableData(this.airports);
      if (!this.airportPagination || this.airportPagination.lastPage !== page.totalPages) {
        this.airportPagination = this.airportsTableAdapterService.getPagination();
        this.airportPagination.lastPage = page.totalPages;
      }
    });
  }


  public onChangePage(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.filterAirportTable();
    }
  }

  public onBarButtonClicked(barButtonType: BarButtonType): void {
    this.barButtonActions[barButtonType]();
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onSearch(value: string): void {
    this.airportFilter['search'] = value;
    this.filterAirportTable();
  }

  public onAirportsSelected(selectedItems: number[]): void {
    this.selectedItems = selectedItems;
  }

  public onAirportAction(action: { actionId: string; selectedItem: number }): void {
    this.selectedItem = action.selectedItem;
    this.airportTableActions[action.actionId](action.selectedItem);
  }

  private newAirport(): void {
    this.router.navigate(['airports', 'new']);
  }

  private disableSelectedAirports(): void {
    this.initializeModal(this.confirmMultipleDisableModal);
    this.modalService.openModal();
  }

  private editAirport(selectedItem: number): void {
    this.router.navigate(['airports', this.airports[selectedItem].id ]);
  }

  private disableAirport(selectedItem: number): void {
    this.translationParams = {airport: this.airports[selectedItem]?.name};
    this.initializeModal(this.confirmDisableModal);
    this.modalService.openModal();
  }

  public onFilterAirports(airportFilter: ColumnFilter) {
    this.airportFilter[airportFilter.identifier] = airportFilter.searchTerm;
    this.filterAirportTable();
  }

  public onSortAirports(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.airportSortForm.patchValue({ sort: sort });
    this.filterAirportTable();
  }

  public onConfirmDisableMultipleAirports() {
    console.log('DELETING AIRPORTS ', this.selectedItems.map(item => this.airports[item].id));
  }

  public onConfirmDisableAirport(): void {
    this.airportsService.deleteAirport(this.airports[this.selectedItem]).subscribe(() => {
      this.filterAirportTable();
    });
  }

  public checkShowDisabled(showDisabled: boolean): void {
    if (showDisabled) {
      this.airportFilter['filter_removedAt'] = '';
    } else {
      this.airportFilter['filter_removedAt'] = null;
    }
    this.filterAirportTable();
  }

  private filterAirportTable(): void {
    this.airportAdvancedSearchForm.patchValue(this.airportFilter);
    const filter = {
      ...this.airportAdvancedSearchForm.value,
      ...this.airportSortForm.value,
      page: this.currentPage
    };
    this.obtainAirportsTable(filter);
  }
}
