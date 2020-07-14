import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { BarButtonType, BarButton, } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { CountryTableAdapterService } from './services/country-table-adapter.service';
import { CountriesService } from './services/countries.service';
import { Country, EMPTY_COUNTRY, SaveCountry } from './models/country';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Observable } from 'rxjs';

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

  private readonly EDIT_COUNTRY_TITLE = 'Editar país';
  private readonly CREATE_COUNTRY_TITLE = 'Crear país';

  public pageTitle = 'Países';
  public userData = { userName: 'Usuario', userRole: 'Administrador' };
  public countryColumnsHeader: Array<ColumnHeaderModel>;
  public countriesColumnsData: Array<RowDataModel>;
  public countriesSelectedCount = 0;
  public countryDetailColumnsData: Array<RowDataModel>;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo país' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  public countryDetailTitle: string;
  public countrySelected: Country = EMPTY_COUNTRY;

  private selectedItem: number;
  private countriesList: Array<Country>;
  private readonly barButtonActions = { new: this.newCountry.bind(this) };
  private readonly countryTableActions = {
    edit: this.editCountry.bind(this),
    delete: this.deleteCountry.bind(this)
  };

  constructor(
    private readonly modalService: ModalService,
    private readonly countriesService: CountriesService,
    private readonly countryTableAdapterService: CountryTableAdapterService
  ) { }

  ngOnInit(): void {
    this.initializeCountryTable();
  }

  private initializeCountryTable(): void {
    this.countryColumnsHeader = this.countryTableAdapterService.getCountryColumnsHeader();
    this.countriesService.getCountries().subscribe((data: Array<Country>) => {
      this.countriesList = data;
      this.countriesColumnsData = this.countryTableAdapterService.getCountryTableData(this.countriesList);
    });
  }

  public onSaveCountry(country: SaveCountry): void {
    let saveCountry: Observable<Country[]>;
    if (!country.oldCode) {
      saveCountry = this.countriesService.addCountry(country);
    } else {
      saveCountry = this.countriesService.editCountry(country);
    }
    saveCountry.subscribe((data: Array<Country>) => {
      this.countriesList = data;
      this.countriesColumnsData = this.countryTableAdapterService.getCountryTableData(this.countriesList);
    });
  }

  public getCountries(): Array<Country> {
    return this.countriesList;
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
    this.countryDetailTitle = this.CREATE_COUNTRY_TITLE;
    this.initializeCountryDetailModal(this.CREATE_COUNTRY_TITLE, { ...EMPTY_COUNTRY });
    this.modalService.openModal();
  }

  private editCountry(selectedItem: number): void {
    this.initializeCountryDetailModal(this.EDIT_COUNTRY_TITLE, {
      ...this.countriesList[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteCountry(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onConfirmDeleteCountry(): void {
    this.countriesService.deleteCountry(this.countriesList[this.selectedItem]).subscribe(() => {
      this.initializeCountryTable();
    });
  }
}
