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
} from 'rxjs/operators';
import { CountriesService } from 'src/app/modules/dashboards/masters/countries/services/countries.service';
import { CitiesService } from 'src/app/modules/dashboards/masters/cities/services/cities.service';
import { City } from 'src/app/modules/dashboards/masters/cities/models/city';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';
import { FlightRulesType, CustomsType } from '../../../../models/airport';
import { MeasureType, MEASURE_LIST } from 'src/app/core/models/base/measure';
import { TranslateService } from '@ngx-translate/core';

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


  public measureList: Array<{ label: string, value: MeasureType }>;
  public FLIGHT_RULES_TYPE = FlightRulesType;
  public CUSTOMS_TYPE = CustomsType;

  cities$: Observable<City[]>;
  citiesInput$ = new Subject<string>();
  citiesLoading = false;
  countries$: Observable<Country[]>;
  countriesInput$ = new Subject<string>();
  countriesLoading = false;

  private unsubscriber$: Subject<void> = new Subject();

  constructor(
    private countriesService: CountriesService,
    private citiesServices: CitiesService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
    this.generalDataForm
      .get('specialConditions')
      .valueChanges.pipe(takeUntil(this.unsubscriber$))
      .subscribe((specialConditions) =>
        this.specialConditionsChanged.next(specialConditions)
      );
    this.translateService.get('MEASURES.UNITS').subscribe((data: Array<string>) => {
      this.measureList = MEASURE_LIST.map((measureValue: string) => {
        return {
          label: data[measureValue],
          value: MeasureType[measureValue]
        }
      });
    });
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
