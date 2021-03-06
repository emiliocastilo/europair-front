import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Observable, concat, of } from 'rxjs';
import {
  takeUntil,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  debounceTime,
  filter,
} from 'rxjs/operators';
import { CountriesService } from 'src/app/modules/dashboards/masters/countries/services/countries.service';
import { CitiesService } from 'src/app/modules/dashboards/masters/cities/services/cities.service';
import { City } from 'src/app/modules/dashboards/masters/cities/models/city';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';
import { FlightRulesType, CustomsType } from '../../../../models/airport';
import { MeasureType } from 'src/app/core/models/base/measure';
import { TranslateService } from '@ngx-translate/core';
import { TimeConversionService } from 'src/app/core/services/time-conversion.service';
import { TimeZone } from 'src/app/core/models/base/time-zone';

@Component({
  selector: 'app-airport-general-data',
  templateUrl: './airport-general-data.component.html',
  styleUrls: ['./airport-general-data.component.scss'],
})
export class AirportGeneralDataComponent implements OnInit, OnDestroy {
  @Input()
  public generalDataForm: FormGroup;
  @Output()
  public specialConditionsChanged: EventEmitter<boolean> = new EventEmitter();

  public measureList: Array<{ label: string; value: MeasureType }>;
  public FLIGHT_RULES_TYPE = FlightRulesType;
  public CUSTOMS_TYPE = CustomsType;

  cities$: Observable<City[]>;
  citiesInput$ = new Subject<string>();
  timeZones$: Observable<TimeZone[]>;
  citiesLoading = false;
  countries$: Observable<Country[]>;
  countriesInput$ = new Subject<string>();
  countriesLoading = false;
  countryIdSelected: string;

  private unsubscriber$: Subject<void> = new Subject();

  private elevationUnits: MeasureType[] = [MeasureType.FOOT, MeasureType.METER];

  constructor(
    private countriesService: CountriesService,
    private citiesServices: CitiesService,
    private translateService: TranslateService,
    private timeConversionService: TimeConversionService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
    this.loadTimeZones();
    this.initGeneralDataFormSubscriptions();
    this.translateService
      .get('MEASURES.UNITS')
      .subscribe((data: Array<string>) => {
        this.measureList = this.elevationUnits.map((measureValue: string) => {
          return {
            label: data[measureValue],
            value: MeasureType[measureValue],
          };
        });
      });
  }

  private loadCities() {
    this.cities$ = concat(
      of([]), // default items
      this.citiesInput$.pipe(
        filter(() => !!this.countryIdSelected),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.citiesLoading = true)),
        switchMap((term) =>
          this.citiesServices
            .getCities({
              filter_name: term,
              'filter_country.id': this.countryIdSelected,
            })
            .pipe(
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
          this.countriesService.getCountries({ filter_name: term }).pipe(
            map((page) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.countriesLoading = false))
          )
        )
      )
    );
  }

  private loadTimeZones(): void {
    this.timeZones$ = this.timeConversionService.getTimeZones();
  }

  private initGeneralDataFormSubscriptions(): void {
    this.generalDataForm
      .get('specialConditions')
      .valueChanges.pipe(takeUntil(this.unsubscriber$))
      .subscribe((specialConditions) =>
        this.specialConditionsChanged.next(specialConditions)
      );
    this.generalDataForm
      .get('country')
      .valueChanges.pipe(
        tap((_) => {
          this.generalDataForm.get('city').setValue(null);
        }),
        filter((country: Country) => !!(country && country.id)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        (country: Country) => (this.countryIdSelected = country.id.toString())
      );
  }

  public changeValueIslands(value: boolean, itemSelected: string): void {
    if (value === true){
      if (itemSelected === 'balearics') {
        this.generalDataForm.get('canary_islands').setValue(false);
      } else {
        this.generalDataForm.get('balearics').setValue(false);
      }
    }
  }

  public isCountrySpainSelected(): boolean {
    return this.generalDataForm.get('country')?.value?.code === 'ES';
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.generalDataForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.generalDataForm.get(controlName);
    return control && control.hasError(errorName);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
