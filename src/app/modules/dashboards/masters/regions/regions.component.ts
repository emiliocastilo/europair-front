import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Region, EMPTY_REGION } from './models/region';
import { RegionsService } from './services/regions.service';
import { RegionsTableAdapterService } from './services/regions-table-adapter.service';
import { RegionDetailComponent } from './components/region-detail/region-detail.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Airport } from './models/airport';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Country } from '../countries/models/country';
import { CountriesService } from '../countries/services/countries.service';
import { TranslateService } from '@ngx-translate/core';
import { AirportsService } from '../airports/services/airports.service';
import { Page } from 'src/app/core/models/table/pagination/page';

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

  public barButtons: BarButton[];

  public regionForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
  });

  constructor(
    private regionsService: RegionsService,
    private regionsTableAdapterService: RegionsTableAdapterService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private countriesService: CountriesService,
    private translateService: TranslateService,
    private airportService: AirportsService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeRegionsTable();
    this.initializeTablesColumnsHeader();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newRegion: this.translateService.get('REGIONS.NEW'),
      deleteRegion: this.translateService.get('REGIONS.DELETE')
    }).subscribe((data: {newRegion: string, deleteRegion: string}) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newRegion },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteRegion }
      ];
    });
  }

  private initializeTablesColumnsHeader() {
    this.regionColumnsHeader = this.regionsTableAdapterService.getRegionColumnsHeader();
    this.regionCountryColumnsHeader = this.regionsTableAdapterService.getRegionCountryColumnsHeader();
    this.regionAirportColumnsHeader = this.regionsTableAdapterService.getRegionAirportColumnsHeader();
  }

  private initializeRegionsTable() {
    this.regionsService.getRegions().subscribe((data: Page<Region>) => this.getRegionTableData(data.content));
  }

  private getRegionTableData = (regions: Region[]) => {
    this.regions = regions;
    this.regionColumnsData = this.regionsTableAdapterService.getRegionTableDataFromRegions(regions);
    this.regionColumnsPagination = this.initializeClientTablePagination(this.regionColumnsData);
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
    this.getRegionDetailData(data, this.translateService.instant('REGIONS.CREATE'), EMPTY_REGION);
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
      this.translateService.instant('REGIONS.VIEW_REGION'),
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
    this.getRegionDetailData(data, this.translateService.instant('REGIONS.EDIT_REGION'), this.regionSelected);
  };

  private deleteRegion = (selectedItem: number) => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  public onConfirmDeleteRegion() {
    console.log('REGION ELIMINADA', this.regionSelected);
    this.regionsService.deleteRegion(this.regionSelected).subscribe(() => this.initializeRegionsTable());
  }

  public onSaveRegion(newRegion: Region) {
    const saveRegion: Observable<Region> = newRegion.id === null ? this.regionsService.addRegion(newRegion) : this.regionsService.editRegion(newRegion);
    saveRegion.subscribe((region: Region) => this.initializeRegionsTable());
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
      data.airports.content,
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
    console.log(airports);
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
      code: selectedRegion.code,
      name: selectedRegion.name,
    });
  }

  private getCountriesAndAirports$() {
    return forkJoin({
      countries: this.countriesService.getCountries(),
      airports: this.airportService.getAirports(),
    }).pipe(
      tap((data: any) => {
        this.countries = data.countries.content;
        this.airports = data.airports.content;
      })
    );
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.regionsTableAdapterService.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
