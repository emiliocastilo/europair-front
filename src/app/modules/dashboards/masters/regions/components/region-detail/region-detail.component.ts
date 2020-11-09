import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Region, EMPTY_REGION } from '../../models/region';
import { Airport } from '../../models/airport';
import { Country } from '../../../countries/models/country';
import { MatTableDataSource } from '@angular/material/table';
import { CountriesService } from '../../../countries/services/countries.service';
import { AirportsService } from '../../../airports/services/airports.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PageEvent } from '@angular/material/paginator';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.scss'],
})
export class RegionDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public regionForm: FormGroup;
  @Input()
  public set regionDetail(regionDetail: Region) {
    this._regionDetail = { ...regionDetail };
  }
  @Output()
  public saveRegion: EventEmitter<Region> = new EventEmitter();

  public _regionDetail: Region = { ...EMPTY_REGION };

  public airportsList: Array<Airport>;
  public dataSourceAirports: MatTableDataSource<Airport>;
  public resultsAirportsLength: number = 0;
  public pageAirportsSize: number = 5;
  public columnsAirportsToDisplay: Array<string> = ['selection', 'code', 'name'];
  public airportsSelected: Array<number>;
  
  public countriesList: Array<Country>;
  public dataSourceCountries: MatTableDataSource<Country>;
  public resultsCountriesLength: number = 0;
  public pageCountriesSize: number = 5;
  public columnsCountriesToDisplay: Array<string> = ['selection', 'code', 'name'];
  public countriesSelected: Array<number>;
  constructor(
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService
  ) {}

  ngOnInit(): void {
    this.initializeTables();
  }

  private initializeTables(): void {
    this.refreshAirportsData({ page: '0', size: '5' });
    this.refreshCountriedsData({ page: '0', size: '5' });
  }

  private refreshAirportsData(searchFilter: SearchFilter = {}) {
    this.airportsService.getAirports(searchFilter).subscribe((page: Page<Airport>) => {
      this.dataSourceAirports = new MatTableDataSource(page.content);
      this.resultsAirportsLength = page.totalElements;
      this.pageAirportsSize = page.size;
    });
  }

  private refreshCountriedsData(searchFilter: SearchFilter = {}) {
    this.countriesService.getCountries(searchFilter).subscribe((page: Page<Country>) => {
      this.dataSourceCountries = new MatTableDataSource(page.content);
      this.resultsCountriesLength = page.totalElements;
      this.pageCountriesSize = page.size;
    });
  }

  public onSaveRegion() {
    console.log({
      ...this._regionDetail,
      ...this.regionForm.value,
    });
    this.saveRegion.next({
      ...this._regionDetail,
      ...this.regionForm.value,
    });
  }
  
  public checkAirport(checked: boolean, airport: Airport): void {
    if (checked) {
      this._regionDetail.airports.push(airport);
    } else {
      const index: number = this._regionDetail.airports.findIndex((item: Airport) => item.id === airport.id);
      this._regionDetail.airports.splice(index, 1);
    }
  }

  public checkCountry(checked: boolean, country: Country): void {
    if (checked) {
      this._regionDetail.countries.push(country);
    } else {
      const index: number = this._regionDetail.countries.findIndex((item: Country) => item.id === country.id);
      this._regionDetail.countries.splice(index, 1);
    }
  }

  public isCountryChecked(countryId: number): boolean {
    return this._regionDetail.countries.some(
      (country: Country) => country.id === countryId
    );
  }

  public isAirportChecked(airportId: number): boolean {
    return this._regionDetail.airports.some((airport: Airport) => airport.id === airportId);
  }

  
  public onPageAirports(pageEvent: PageEvent): void {
    this.refreshAirportsData({
      page: pageEvent.pageIndex.toString(),
      size: pageEvent.pageSize.toString()
    });
  }

  
  public onPageCountries(pageEvent: PageEvent): void {
    this.refreshCountriedsData({
      page: pageEvent.pageIndex.toString(),
      size: pageEvent.pageSize.toString()
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.regionForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.regionForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
