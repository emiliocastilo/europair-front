import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Region, EMPTY_REGION } from './models/region';
import { RegionsService } from './services/regions.service';
import { RegionsTableAdapterService } from './services/regions-table-adapter.service';
import { RegionDetailComponent } from './components/region-detail/region-detail.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Airport } from './models/airport';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Country } from '../countries/models/country';
import { CountriesService } from '../countries/services/countries.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent implements OnInit {
  @ViewChild(RegionDetailComponent, { static: true, read: ElementRef })
  public regionDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  private readonly VIEW_REGION_TITLE = 'Detalle región';
  private readonly EDIT_REGION_TITLE = 'Editar región';
  private readonly CREATE_REGION_TITLE = 'Crear región';

  public regionColumnsHeader: ColumnHeaderModel[] = [];
  public regionColumnsData: RowDataModel[] = [];
  public regionColumnsPagination: PaginationModel;
  public regionCountryColumnsHeader: ColumnHeaderModel[] = [];
  public regionCountryColumnsData: RowDataModel[] = [];
  public regionCountryColumnsPagination: PaginationModel;
  public regionAirportColumnsHeader: ColumnHeaderModel[] = [];
  public regionAirportColumnsData: RowDataModel[] = [];
  public regionAirportColumnsPagination: PaginationModel;
  public countries: Country[];
  public airports: Airport[];
  public regions: Region[];
  public regionSelected: Region = EMPTY_REGION;
  public regionDetailTitle: string;

  public pageTitle = 'Regiones';
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva región' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];

  public regionForm = this.fb.group({
    name: ['', Validators.required],
  });

  private mockRegions: Region[] = [];
  private idMockRegion: number = 1;

  constructor(
    private regionsService: RegionsService,
    private regionsTableAdapterService: RegionsTableAdapterService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.initializeRegionsTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeTablesColumnsHeader() {
    this.regionColumnsHeader = this.regionsTableAdapterService.getRegionColumnsHeader();
    this.regionCountryColumnsHeader = this.regionsTableAdapterService.getRegionCountryColumnsHeader();
    this.regionAirportColumnsHeader = this.regionsTableAdapterService.getRegionAirportColumnsHeader();
  }

  private initializeRegionsTable() {
    // this.regionsService.getRegions().subscribe(this.getRegionTabeData);
    this.getRegionTableData(this.mockRegions);
  }

  private getRegionTableData = (regions: Region[]) => {
    this.regions = regions;
    this.regionColumnsData = this.regionsTableAdapterService.getRegionTableDataFromRegions(
      regions
    );
    this.regionColumnsPagination = this.initializeClientTablePagination(
      this.regionColumnsData
    );
  };

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private newRegion = () => {
    this.getCountriesAndAirports$().subscribe(this.getNewRegionDetailData);
  };

  private getNewRegionDetailData = (data: any) => {
    this.regionSelected = { ...EMPTY_REGION };
    this.regionForm.enable();
    this.regionForm.reset();
    this.getRegionDetailData(data, this.CREATE_REGION_TITLE, EMPTY_REGION);
  };

  private barButtonActions = {
    new: this.newRegion,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onRegionAction(action: { actionId: string; selectedItem: number }) {
    console.log('onRegionAction', action);
    this.regionSelected = { ...this.regions[action.selectedItem] };
    this.regionTableActions[action.actionId](action.selectedItem);
  }

  private viewRegion = (selectedItem: number) => {
    this.getCountriesAndAirports$().subscribe(this.getViewRegionDetailData);
  };

  private getViewRegionDetailData = (data: any) => {
    this.updateRegionrForm(this.regionSelected);
    this.regionForm.disable();
    this.getRegionDetailData(
      data,
      this.VIEW_REGION_TITLE,
      this.regionSelected,
      false
    );
  };

  private editRegion = (selectedItem: number) => {
    this.getCountriesAndAirports$().subscribe(this.getEditRegionDetailData);
  };

  private getEditRegionDetailData = (data: any) => {
    this.updateRegionrForm(this.regionSelected);
    this.regionForm.enable();
    this.getRegionDetailData(data, this.EDIT_REGION_TITLE, this.regionSelected);
  };

  private deleteRegion = (selectedItem: number) => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  public onConfirmDeleteRegion() {
    console.log('REGION ELIMINADA', this.regionSelected);
    this.mockRegions = this.mockRegions.filter(
      (mockRegion: Region) => mockRegion.id !== this.regionSelected.id
    );
    this.initializeRegionsTable();
  }

  public onSaveRegion(newRegion: Region) {
    if (newRegion.id) {
      this.mockRegions = this.mockRegions.map((mockRegion: Region) => {
        return mockRegion.id !== newRegion.id ? mockRegion : { ...newRegion };
      });
    } else {
      this.mockRegions = [
        ...this.mockRegions,
        { ...newRegion, id: this.idMockRegion },
      ];
      this.idMockRegion++;
    }
    this.initializeRegionsTable();
  }

  private regionTableActions = {
    view: this.viewRegion,
    edit: this.editRegion,
    delete: this.deleteRegion,
  };

  private getRegionDetailData = (
    data: any,
    regionDetailTitle: string,
    regionSelected: Region,
    editable = true
  ) => {
    this.regionCountryColumnsData = this.getRegionCountryTableDataForRegion(
      regionSelected,
      data.countries.content,
      editable
    );
    this.regionCountryColumnsPagination = this.initializeClientTablePagination(
      this.regionCountryColumnsData
    );
    this.regionAirportColumnsData = this.getRegionAirportTableDataForRegion(
      regionSelected,
      data.airports,
      editable
    );
    this.regionAirportColumnsPagination = this.initializeClientTablePagination(
      this.regionAirportColumnsData
    );
    this.regionCountryColumnsPagination = this.regionsTableAdapterService.getPagination();
    this.regionCountryColumnsPagination.lastPage =
      this.regionCountryColumnsData.length /
      this.regionCountryColumnsPagination.elementsPerPage;
    this.regionDetailTitle = regionDetailTitle;
    this.initializeModal(this.regionDetailModal);
    this.modalService.openModal();
  };

  private getRegionCountryTableDataForRegion(
    region: Region,
    countries: Country[] = [],
    editable = true
  ): RowDataModel[] {
    const regionCountries = region ? region.countries : [];
    return this.regionsTableAdapterService.getRegionCountryTableData(
      countries,
      regionCountries,
      'assigned-country-',
      editable
    );
  }

  private getRegionAirportTableDataForRegion(
    region: Region,
    airports: Airport[] = [],
    editable = true
  ): RowDataModel[] {
    const regionAirports = region ? region.airports : [];
    return this.regionsTableAdapterService.getRegionAirportTableData(
      airports,
      regionAirports,
      'assigned-airport-',
      editable
    );
  }

  private updateRegionrForm(selectedRegion: Region) {
    this.regionForm.setValue({
      name: selectedRegion.name,
    });
  }

  private getCountriesAndAirports$() {
    return forkJoin({
      countries: this.countriesService.getCountries(),
      airports: this.regionsService.getAirports(),
    }).pipe(
      tap((data: any) => {
        this.countries = data.countries.content;
        this.airports = data.airports;
      })
    );
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    let pagination = this.regionsTableAdapterService.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
