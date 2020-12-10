import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Region, EMPTY_REGION } from '../../models/region';
import { Country } from '../../../countries/models/country';
import { MatTableDataSource } from '@angular/material/table';
import { CountriesService } from '../../../countries/services/countries.service';
import { AirportsService } from '../../../airports/services/airports.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PageEvent } from '@angular/material/paginator';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { Airport } from '../../../airports/models/airport';

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
    this.dataSourceCountries = new MatTableDataSource(this._regionDetail.countries);
    this.dataSourceAirports = new MatTableDataSource(this._regionDetail.airports);
  }
  @Output()
  public saveRegion: EventEmitter<Region> = new EventEmitter();

  public _regionDetail: Region = { ...EMPTY_REGION };

  public countries$: Observable<Country[]>;
  public countriesInput$ = new Subject<string>();
  public countriesLoading = false;
  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  public columnsCountriesToDisplay: Array<string> = ['code', 'name', 'actions'];
  public columnsAirportsToDisplay: Array<string> = ['iataCode', 'icaoCode', 'name', 'actions'];
  public countriesList: Array<Country>;
  public dataSourceCountries: MatTableDataSource<Country> = new MatTableDataSource([]);
  public dataSourceAirports: MatTableDataSource<Airport> = new MatTableDataSource([]);
  public resultsCountriesLength: number = 0;
  public pageCountriesSize: number = 5;
  public countriesSelected: Array<number>;

  public countriesControl: FormControl = this.fb.control('');
  public airportsControl: FormControl = this.fb.control('');

  constructor(
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeTables();
  }

  private initializeTables(): void {
    this.loadCountries();
    this.loadAirports();
    this.initializeSubscribes();
  }

  private loadCountries(): void {
    this.countries$ = concat(
      of([]), // default items
      this.countriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.countriesLoading = true)),
        switchMap((term: string) =>
          this.countriesService.getCountries({ filter_name: term?.toUpperCase() }).pipe(
            map((page: Page<Country>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.countriesLoading = false))
          )
        )
      )
    );
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

  private initializeSubscribes() {
    this.countriesControlValueChangesSubscribe();
    this.airportsControlValueChangesSubscribe();
  }

  private countriesControlValueChangesSubscribe(): void {
    this.countriesControl.valueChanges
      .subscribe(this.onCountriesControlChanges);
  }

  private onCountriesControlChanges = (countrySelected: Country): void => {
    this.countriesControl.patchValue([], { emitEvent: false });
    if (this.isCountryAlreadyAdded(countrySelected)) {
      return
    }
    this.dataSourceCountries = new MatTableDataSource([...this.dataSourceCountries.data, countrySelected]);
  };

  private isCountryAlreadyAdded(countrySelected: Country): boolean {
    return !!this.dataSourceAirports.data.find(country => country.id === countrySelected.id);
  }

  private airportsControlValueChangesSubscribe(): void {
    this.airportsControl.valueChanges
      .subscribe(this.onAirportsControlChanges);
  }

  private onAirportsControlChanges = (airportSelected: Airport): void => {
    this.airportsControl.patchValue([], { emitEvent: false });
    if (this.isAiportAlreadyAdded(airportSelected)) {
      return
    }
    this.dataSourceAirports = new MatTableDataSource([...this.dataSourceAirports.data, airportSelected]);
  };

  private isAiportAlreadyAdded(airportSelected: Airport): boolean {
    return !!this.dataSourceAirports.data.find(aiport => aiport.id === airportSelected.id);
  }

  public removeCountry(countrySelected: Country): void {
    this.dataSourceCountries = new MatTableDataSource(this.dataSourceCountries.data.filter(country => country.id !== countrySelected.id));
  }

  public removeAirport(airportSelected: Airport): void {
    this.dataSourceAirports = new MatTableDataSource(this.dataSourceAirports.data.filter(airport => airport.id !== airportSelected.id));
  }

  public onSaveRegion() {
    this.saveRegion.next({
      ...this.regionForm.value,
      airports: this.dataSourceAirports.data,
      countries: this.dataSourceCountries.data
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
