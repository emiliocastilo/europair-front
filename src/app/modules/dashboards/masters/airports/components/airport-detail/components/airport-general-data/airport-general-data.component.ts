import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Observable, concat, of } from 'rxjs';
import {
  takeUntil,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  debounceTime,
} from 'rxjs/operators';
import { CountriesService } from 'src/app/modules/dashboards/masters/countries/services/countries.service';
import { CitiesService } from 'src/app/modules/dashboards/masters/cities/services/cities.service';
import { City } from 'src/app/modules/dashboards/masters/cities/models/city';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';

@Component({
  selector: 'app-airport-general-data',
  templateUrl: './airport-general-data.component.html',
  styleUrls: ['./airport-general-data.component.scss'],
})
export class AirportGeneralDataComponent implements OnInit, OnDestroy {
  @Output()
  public generalDataChanged: EventEmitter<any> = new EventEmitter();
  @Output()
  public specialConditionsChanged: EventEmitter<boolean> = new EventEmitter();

  cities$: Observable<City[]>;
  citiesInput$ = new Subject<string>();
  citiesLoading = false;
  countries$: Observable<Country[]>;
  countriesInput$ = new Subject<string>();
  countriesLoading = false;

  private unsubscriber$: Subject<void> = new Subject();
  public generalDataForm = this.fb.group({
    codIATA: ['MAD'],
    codICAO: ['LEMD'],
    name: ['Aeropuerto Adolfo Suárez Madrid-Barajas'],
    country: ['España'],
    city: ['Madrid'],
    timeZone: ['GMT+2'],
    altitude: ['610'],
    latitude: [`N40°29'30.52"`],
    longitude: [`O3°34'10.13"`],
    customs: [false],
    specialConditions: [true],
    flightRules: ['IFR'],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
    private citiesServices: CitiesService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
    this.generalDataForm.valueChanges
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((generalData) => this.generalDataChanged.next(generalData));
    this.generalDataForm
      .get('specialConditions')
      .valueChanges.pipe(takeUntil(this.unsubscriber$))
      .subscribe((specialConditions) =>
        this.specialConditionsChanged.next(specialConditions)
      );
    // TODO for development of certified operators ONLY
    this.specialConditionsChanged.next(true);
  }

  private loadCities() {
    this.cities$ = concat(
      of([]), // default items
      this.citiesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.citiesLoading = true)),
        switchMap((term) =>
          this.citiesServices.getCities().pipe(
            map((page) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.citiesLoading = false))
          )
        )
      )
    );
  }

  private loadCountries() {
    this.countries$ = concat(
      of([]), // default items
      this.countriesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.countriesLoading = true)),
        switchMap((term) =>
          this.countriesService.getCountries().pipe(
            map((page) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.countriesLoading = false))
          )
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
