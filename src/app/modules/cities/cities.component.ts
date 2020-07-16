import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BarButtonType, BarButton, } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { CitiesService } from './services/cities.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Observable } from 'rxjs';
import { CityDetailComponent } from './components/city-detail/city-detail.component';
import { City, EMPTY_CITY } from './models/city';
import { CityTableAdapterService } from './services/city-table-adapter.service';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

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

  private readonly EDIT_COUNTRY_TITLE = 'Editar Ciudad';
  private readonly CREATE_COUNTRY_TITLE = 'Crear Ciudad';

  public pageTitle = 'Ciudades';
  public userData = { userName: 'Usuario', userRole: 'Administrador' };
  public cityColumnsHeader: Array<ColumnHeaderModel>;
  public citiesColumnsData: Array<RowDataModel>;
  public citiesSelectedCount = 0;
  public cityDetailColumnsData: Array<RowDataModel>;
  public cityPagination: PaginationModel;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva Ciudad' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  public cityDetailTitle: string;
  public citySelected: City = EMPTY_CITY;

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
    private readonly cityTableAdapterService: CityTableAdapterService
  ) { }

  ngOnInit(): void {
    this.initializeCityTable();
  }

  private initializeCityTable(): void {
    this.cityColumnsHeader = this.cityTableAdapterService.getCityColumnsHeader();
    this.citiesService.getCities().subscribe((data: Pageable<City>) => {
      this.cities = data.content;
      this.citiesColumnsData = this.cityTableAdapterService.getCityTableData(this.cities);
      this.cityPagination = this.cityTableAdapterService.getPagination();
      this.cityPagination.lastPage = this.cities.length / this.cityPagination.elememtsPerpage;
    });
  }

  public onCity(city: City): void {
    let city$: Observable<City>;
    if (city.id === undefined) {
      city$ = this.citiesService.addCity(city);
    } else {
      city$ = this.citiesService.editCity(city);
    }
    city$.subscribe((data: City) => this.initializeCityTable());
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

  public onCitySelected(selectedIndex: number): void {
    this.selectedItem = selectedIndex;
  }

  public onCityAction(action: { actionId: string; selectedItem: number }): void {
    this.cityTableActions[action.actionId](action.selectedItem);
  }

  private newCity(): void {
    this.cityDetailTitle = this.CREATE_COUNTRY_TITLE;
    this.initializeCityDetailModal(this.CREATE_COUNTRY_TITLE, { ...EMPTY_CITY });
    this.modalService.openModal();
  }

  private editCity(selectedItem: number): void {
    this.initializeCityDetailModal(this.EDIT_COUNTRY_TITLE, {
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
      this.initializeCityTable();
    });
  }
}
