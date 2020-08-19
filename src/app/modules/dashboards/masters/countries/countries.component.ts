import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { BarButtonType, BarButton, } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { CountryTableAdapterService } from './services/country-table-adapter.service';
import { CountriesService } from './services/countries.service';
import { Country, EMPTY_COUNTRY } from './models/country';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Observable, forkJoin } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
  providers: [CountryTableAdapterService]
})
export class CountriesComponent implements OnInit {
  @ViewChild(CountryDetailComponent, { static: true, read: ElementRef })
  private readonly countryDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmDeleteModal: ElementRef;

  public countryColumnsHeader: Array<ColumnHeaderModel>;
  public countriesColumnsData: Array<RowDataModel>;
  public countriesSelectedCount = 0;
  public countryPagination: PaginationModel;
  public countryDetailTitle: string;
  public countrySelected: Country = EMPTY_COUNTRY;

  public barButtons: BarButton[];
  private selectedItem: number;
  private countries: Array<Country>;
  private readonly barButtonActions = { new: this.newCountry.bind(this) };
  private readonly countryTableActions = {
    edit: this.editCountry.bind(this),
    delete: this.deleteCountry.bind(this)
  };

  constructor(
    private readonly modalService: ModalService,
    private readonly countriesService: CountriesService,
    private readonly countryTableAdapterService: CountryTableAdapterService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeCountryTable();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newCountry: this.translateService.get('COUNTRIES.NEW'),
      deleteCountry: this.translateService.get('COUNTRIES.DELETE')
    }).subscribe((data: { newCountry: string; deleteCountry: string; }) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newCountry },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteCountry },
      ];
    });
  }

  private initializeCountryTable(): void {
    this.countryColumnsHeader = this.countryTableAdapterService.getCountryColumnsHeader();
    this.countriesService.getCountries().subscribe((data: Page<Country>) => {
      this.countries = data.content;
      this.countriesColumnsData = this.countryTableAdapterService.getCountryTableData(this.countries);
      this.countryPagination = this.countryTableAdapterService.getPagination();
      this.countryPagination.lastPage = this.countries.length / this.countryPagination.elementsPerPage;
    });
  }

  public onSaveCountry(country: Country): void {
    let saveCountry: Observable<Country>;
    if (country.id === undefined) {
      saveCountry = this.countriesService.addCountry(country);
    } else {
      saveCountry = this.countriesService.editCountry(country);
    }
    saveCountry.subscribe((data: Country) => this.initializeCountryTable());
  }

  public onBarButtonClicked(barButtonType: BarButtonType): void {
    this.barButtonActions[barButtonType]();
  }


  private initializeCountryDetailModal(countryDetailTitle: string, countrySelected: Country): void {
    this.countryDetailTitle = countryDetailTitle;
    this.countrySelected = countrySelected;
    this.initializeModal(this.countryDetailModal);
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onCountrySelected(selectedIndex: number): void {
    this.selectedItem = selectedIndex;
  }

  public onCountryAction(action: { actionId: string; selectedItem: number }): void {
    this.countryTableActions[action.actionId](action.selectedItem);
  }

  private newCountry(): void {
    this.countryDetailTitle = this.translateService.instant('COUNTRIES.CREATE');
    this.initializeCountryDetailModal(this.countryDetailTitle, { ...EMPTY_COUNTRY });
    this.modalService.openModal();
  }

  private editCountry(selectedItem: number): void {
    this.initializeCountryDetailModal(this.translateService.instant('COUNTRIES.EDIT_COUNTRY'), {
      ...this.countries[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteCountry(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onConfirmDeleteCountry(): void {
    this.countriesService.deleteCountry(this.countries[this.selectedItem]).subscribe(() => {
      this.initializeCountryTable();
    });
  }
}
