import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError, filter, takeUntil } from 'rxjs/operators';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { Country } from '../../../masters/countries/models/country';
import { CountriesService } from '../../../masters/countries/services/countries.service';

@Component({
  selector: 'app-search-aircraft',
  templateUrl: './search-aircraft.component.html',
  styleUrls: ['./search-aircraft.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class SearchAircraftComponent implements OnInit {

  public countries$: Observable<Country[]>;
  public countriesInput$ = new Subject<string>();
  public countriesLoading = false;
  public countryIdSelected: string;

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;
  public airportIdSelected: string;

  public searchForm: FormGroup = this.fb.group({
    country: [''],
    airport: [''],
    nearbyAirport: [false],
    category: [''],
    subcategory: [''],
    aircraftType: [''],
    operator: [''],
    passenger: ['']
  });

  private unsubscriber$: Subject<void> = new Subject();
  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService,
    private readonly airportsService: AirportsService
  ) { }

  ngOnInit(): void {
    this.loadCountries();
    this.loadAirports();
    this.initGeneralDataFormSubscriptions();
  }

  private loadCountries() {
    this.countries$ = concat(
      of([]), // default items
      this.countriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.countriesLoading = true)),
        switchMap((term) =>
          this.countriesService.getCountries({ filter_name: term }).pipe(
            map((page) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.countriesLoading = false))
          )
        )
      )
    );
  }

  private loadAirports() {
    this.airports$ = concat(
      of([]), // default items
      this.airportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.airportsLoading = true)),
        switchMap((term): Observable<Airport[]> => {
          const filter = { filter_name: term };
          filter['filter_country.id'] = this.countryIdSelected ?? '';
          return this.airportsService.getAirports(filter).pipe(
            map((page) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.airportsLoading = false)));
        }
        )
      )
    );
  }

  private initGeneralDataFormSubscriptions(): void {
    this.searchForm
      .get('country')
      .valueChanges.pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        (country: Country) => (this.countryIdSelected =  country && country.id.toString())
      );
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.searchForm.get(controlName);
    return control && control.hasError(errorName);
  }

}
