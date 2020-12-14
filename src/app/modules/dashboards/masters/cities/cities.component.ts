import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BarButtonType, BarButton, } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { CitiesService } from './services/cities.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Observable, forkJoin } from 'rxjs';
import { CityDetailComponent } from './components/city-detail/city-detail.component';
import { City, EMPTY_CITY } from './models/city';
import { CityTableAdapterService } from './services/city-table-adapter.service';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { TranslateService } from '@ngx-translate/core';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
  providers: [CityTableAdapterService]
})
export class CitiesComponent implements OnInit {
  @ViewChild(CityDetailComponent, { static: true, read: ElementRef })
  private readonly cityDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmDeleteModal: ElementRef;

  public cityColumnsHeader: Array<ColumnHeaderModel>;
  public citiesColumnsData: Array<RowDataModel>;
  public citiesSelectedCount = 0;
  public cityDetailColumnsData: Array<RowDataModel>;
  public cityPagination: PaginationModel;
  public barButtons: BarButton[];
  public cityDetailTitle: string;
  public citySelected: City = EMPTY_CITY;
  private cityFilter: any = { page: 0 };

  private selectedItem: number;
  private cities: Array<City>;
  private readonly barButtonActions = { new: this.newCity.bind(this) };
  private readonly cityTableActions = {
    edit: this.editCity.bind(this),
    delete: this.deleteCity.bind(this)
  };

  constructor(
    private readonly modalService: ModalService,
    private readonly citiesService: CitiesService,
    private readonly cityTableAdapterService: CityTableAdapterService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeTablesColumnsHeader();
    this.initializeCityTable(this.cityFilter);
  }

  private obtainTranslateText() {
    forkJoin({
      newCity: this.translateService.get('CITIES.NEW'),
      deleteCity: this.translateService.get('CITIES.DELETE')
    }).subscribe((data: { newCity: string; deleteCity: string; }) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newCity },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteCity },
      ];
    });
  }

  private initializeTablesColumnsHeader() {
    this.cityColumnsHeader = this.cityTableAdapterService.getCityColumnsHeader();
  }

  private initializeCityTable(searchFilter?: SearchFilter): void {
    this.citiesService.getCities(searchFilter).subscribe((page: Page<City>) => {
      this.cities = page.content;
      this.citiesColumnsData = this.cityTableAdapterService.getCityTableData(this.cities);
      if (!this.cityPagination || this.cityPagination.lastPage !== page.totalPages) {
        this.cityPagination = this.cityTableAdapterService.getPagination();
        this.cityPagination.lastPage = page.totalPages;
      }
    });
  }

  public onCity(city: City): void {
    let city$: Observable<City>;
    if (city.id === undefined) {
      city$ = this.citiesService.addCity(city);
    } else {
      city$ = this.citiesService.editCity(city);
    }
    city$.subscribe((data: City) => this.filterCityTable());
  }

  public getCities(): Array<City> {
    return this.cities;
  }

  public onBarButtonClicked(barButtonType: BarButtonType): void {
    this.barButtonActions[barButtonType]();
  }


  private initializeCityDetailModal(cityDetailTitle: string, citySelected: City): void {
    this.cityDetailTitle = cityDetailTitle;
    this.citySelected = citySelected;
    this.initializeModal(this.cityDetailModal);
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onChangePage(page: number): void {
    console.log('PAGE', page, this.cityPagination);
    if (page !== this.cityFilter['page']) {
      this.cityFilter['page'] = page;
      this.filterCityTable();
    }
  }

  public onFilterCities(regionFilter: ColumnFilter) {
    this.cityFilter[regionFilter.identifier] = regionFilter.searchTerm;
    this.filterCityTable();
  }

  public onSortCities(sortByColumn: SortByColumn) {
    this.cityFilter['sort'] = sortByColumn.column + ',' + sortByColumn.order;
    this.filterCityTable();
  }

  private filterCityTable(): void {
    this.initializeCityTable(this.cityFilter);
  }

  public onCitySelected(selectedIndex: number): void {
    this.selectedItem = selectedIndex;
  }

  public onCityAction(action: { actionId: string; selectedItem: number }): void {
    this.cityTableActions[action.actionId](action.selectedItem);
  }

  private newCity(): void {
    this.cityDetailTitle = this.translateService.instant('CITIES.CREATE');
    this.initializeCityDetailModal(this.cityDetailTitle, { ...EMPTY_CITY });
    this.modalService.openModal();
  }

  private editCity(selectedItem: number): void {
    this.initializeCityDetailModal(this.translateService.instant('CITIES.EDIT_CITY'), {
      ...this.cities[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteCity(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onConfirmDeleteCity(): void {
    this.citiesService.deleteCity(this.cities[this.selectedItem]).subscribe(() => {
      this.filterCityTable();
    });
  }
}
