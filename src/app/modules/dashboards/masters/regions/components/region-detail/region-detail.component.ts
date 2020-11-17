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
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';

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

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  public columnsCountriesToDisplay: Array<string> = ['selection', 'code', 'name'];
  public countriesList: Array<Country>;
  public dataSourceCountries: MatTableDataSource<Country>;
  public resultsCountriesLength: number = 0;
  public pageCountriesSize: number = 5;
  public countriesSelected: Array<number>;
  constructor(
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService
  ) {}

  ngOnInit(): void {
    this.initializeTables();
  }

  private initializeTables(): void {
    this.loadAirports();
    this.refreshCountriedsData({ page: '0', size: '5' });
  }

  private loadAirports(): void {
    this.airports$ = concat(
      of([]), // default items
      this.airportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.airportsLoading = true)),
        switchMap((term: string): Observable<Airport[]> =>
          this.airportsService.searchAirports(term).pipe(
            map((page: Page<Airport>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)))
        )
      )
    );
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
