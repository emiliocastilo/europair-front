import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { InputTextComponent } from 'src/app/core/components/basic/input-text/input-text.component';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import {
  DAYS_OF_WEEK,
  FileRoute,
  FrequencyType,
  FREQUENCY_LIST,
} from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';
import { FileErrorStateMatcher } from '../file-detail/file-detail.component';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss'],
})
export class RouteDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) flightTable: MatTable<any>;
  @ViewChild(InputTextComponent, { read: ElementRef })
  routeGenerator: ElementRef;

  public isLoading: boolean = false;

  public originAirports$: Observable<Airport[]>;
  public originAirportsInput$ = new Subject<string>();
  public originAirportsLoading = false;
  public originAirportIdSelected: string;

  public destinationAirports$: Observable<Airport[]>;
  public destinationAirportsInput$ = new Subject<string>();
  public destinationAirportsLoading = false;
  public destinationAirportIdSelected: string;

  public readonly routeMask =
    '000-000||000-000-000||000-000-000-000||000-000-000-000-000||000-000-000-000-000-000||000-000-000-000-000-000-000';
  public readonly routePattern = {
    '0': { pattern: new RegExp('[a-zA-Z0-9]') },
  };
  public readonly fileErrorStateMatcher = new FileErrorStateMatcher();

  public dataSource = new MatTableDataSource<Flight>();
  public frequencyList = [];
  public weekDaysList = [];
  public monthDaysList: number[];
  public pageTitle: string;
  private fileId: number;
  private fileRoute: FileRoute;
  private flightSearchFilter: SearchFilter = {};

  public routeForm: FormGroup = this.fb.group({
    label: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        this.getLabelFormatValidator(),
      ],
    ],
    frequency: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    weekdays: [{ value: [], disabled: true }, Validators.required],
    monthDays: [{ value: [], disabled: true }, Validators.required],
  });

  public columnsToDisplay = [
    { title: 'Aeropuerto Origen', label: 'origin' },
    { title: 'Aeropuerto Destino', label: 'destination' },
    { title: 'Fecha salida', label: 'departureTime' },
    { title: 'Asientos F', label: 'seatsF' },
    { title: 'Asientos C', label: 'seatsC' },
    { title: 'Asientos Y', label: 'seatsY' },
  ];

  public columnsProps = this.columnsToDisplay.map((e) => e.label);
  public paginatorLength: number = 0;
  public paginatorSize: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly airportsService: AirportsService,
    private readonly translateService: TranslateService,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // this.loadOriginAirports();
    // this.loadDestinationAirports();
    this.getRouteInfo();
    this.frequencyValueChangesSubscribe();
    this.startDateValueChangesSubscribe();
    this.loadFrequencies();
    this.loadWeekDays();
  }

  ngAfterViewInit(): void {}

  private getRouteInfo() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
    });
    this.route.data.subscribe((data) => {
      this.pageTitle = data.title;
    });
  }

  private frequencyValueChangesSubscribe() {
    this.routeForm
      .get('frequency')
      .valueChanges.subscribe(this.onFrequencyChanges);
  }

  private onFrequencyChanges = (frequencyType: FrequencyType) => {
    this.routeForm.enable({ emitEvent: false });
    switch (frequencyType) {
      case FrequencyType.ADHOC:
        this.resetAndDisableControl(this.routeForm.get('weekdays'));
        this.resetAndDisableControl(this.routeForm.get('monthDays'));
        break;
      case FrequencyType.DAILY:
      case FrequencyType.WEEKLY:
      case FrequencyType.BIWEEKLY:
        this.resetAndDisableControl(this.routeForm.get('monthDays'));
        break;
      case FrequencyType.DAY_OF_MONTH:
        this.resetAndDisableControl(this.routeForm.get('weekdays'));
        break;

      default:
        this.resetAndDisableControl(this.routeForm.get('weekdays'));
        this.resetAndDisableControl(this.routeForm.get('monthDays'));
        break;
    }
  };

  private resetAndDisableControl(control: AbstractControl) {
    control.reset();
    control.disable();
  }

  private startDateValueChangesSubscribe() {
    this.routeForm
      .get('startDate')
      .valueChanges.subscribe(this.onStartDateChanges);
  }

  private onStartDateChanges = (startDate: string) => {
    const [year, month, day] = startDate.split('-').map((value) => +value);
    this.routeForm.get('monthDays').reset();
    this.monthDaysList = Array.from(
      Array(this.getDaysInMonth(month, year))
    ).map((e, i) => i + 1);
  };

  private getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  private loadFrequencies() {
    this.translateService
      .get('FREQUENCIES.UNITS')
      .subscribe((data: Array<string>) => {
        this.frequencyList = FREQUENCY_LIST.map((frequencyValue: string) => {
          return {
            label: data[frequencyValue],
            value: FrequencyType[frequencyValue],
          };
        });
      });
  }

  private loadWeekDays() {
    this.translateService
      .get('DAYS.COMPLETE')
      .subscribe((data: Array<string>) => {
        this.weekDaysList = DAYS_OF_WEEK.map((weekDay: string) => {
          return {
            label: data[weekDay],
            value: weekDay,
          };
        });
      });
  }

  public generateFlights() {
    if (!this.routeForm.valid) {
      this.routeForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.fileRouteService
      .createFileRoute(
        this.fileId,
        this.createFilteRouteFromRouteForm(this.routeForm)
      )
      .pipe(
        tap((fileRoute: FileRoute) => (this.fileRoute = fileRoute)),
        switchMap((fileRoute: FileRoute) =>
          this.flightService.getFlights(this.fileId, fileRoute.id)
        ),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(this.updateFlightData);
  }

  private updateFlightData = (flights: Page<Flight>) => {
    this.dataSource = new MatTableDataSource<Flight>(flights.content);
    this.paginatorLength = flights.totalElements;
    this.paginatorSize = flights.size;
  };

  private createFilteRouteFromRouteForm(routeForm: FormGroup): FileRoute {
    let { weekdays, monthDays, ...fileRoute } = routeForm.value;
    if (routeForm.value?.frequency === '') {
      fileRoute = {
        ...fileRoute,
        label: fileRoute.label.toUpperCase(),
        frequency: FrequencyType.ADHOC,
      };
    } else {
      fileRoute = {
        ...fileRoute,
        label: fileRoute.label.toUpperCase(),
      };
    }
    return this.getFrequencyDays(weekdays, monthDays, fileRoute);
  }

  private getFrequencyDays(
    weekdays: string[],
    monthDays: number[],
    fileRoute: FileRoute
  ): FileRoute {
    if (Array.isArray(weekdays) && weekdays.length > 0) {
      return {
        ...fileRoute,
        frequencyDays: weekdays.map((weekday) => ({ weekday: weekday })),
      };
    } else if (Array.isArray(monthDays) && monthDays.length > 0) {
      return {
        ...fileRoute,
        frequencyDays: monthDays.map((monthDay) => ({ monthDay: monthDay })),
      };
    } else {
      return fileRoute;
    }
  }

  public getReturnRoute() {
    return `/files/${this.fileId}`;
  }

  public onPage(pageEvent: PageEvent) {
    this.flightSearchFilter['page'] = pageEvent.pageIndex.toString();
    this.flightSearchFilter['size'] = pageEvent.pageSize.toString();
    this.flightService
      .getFlights(this.fileId, this.fileRoute.id, this.flightSearchFilter)
      .subscribe(this.updateFlightData);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.routeForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.routeForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public isControlDisabled(controlName: string): boolean {
    const control = this.routeForm.get(controlName);
    return control?.disabled;
  }

  public getLabelFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const unmaskedValue = control.value.replace(/-/g, '');
      return unmaskedValue.length % 3
        ? { labelFormatNotValid: { value: control.value } }
        : null;
    };
  }

  // private loadOriginAirports(): void {
  //   this.originAirports$ = concat(
  //     of([]), // default items
  //     this.originAirportsInput$.pipe(
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       tap(() => (this.originAirportsLoading = true)),
  //       switchMap(
  //         (term: string): Observable<Airport[]> => {
  //           const filter = { filter_name: term };
  //           return this.airportsService.getAirports(filter).pipe(
  //             map((page: Page<Airport>) => page.content),
  //             catchError(() => of([])), // empty list on error
  //             tap(() => (this.originAirportsLoading = false))
  //           );
  //         }
  //       )
  //     )
  //   );
  // }

  // private loadDestinationAirports(): void {
  //   this.destinationAirports$ = concat(
  //     of([]), // default items
  //     this.destinationAirportsInput$.pipe(
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       tap(() => (this.destinationAirportsLoading = true)),
  //       switchMap(
  //         (term: string): Observable<Airport[]> => {
  //           const filter = { filter_name: term };
  //           return this.airportsService.getAirports(filter).pipe(
  //             map((page: Page<Airport>) => page.content),
  //             catchError(() => of([])), // empty list on error
  //             tap(() => (this.destinationAirportsLoading = false))
  //           );
  //         }
  //       )
  //     )
  //   );
  // }
}
