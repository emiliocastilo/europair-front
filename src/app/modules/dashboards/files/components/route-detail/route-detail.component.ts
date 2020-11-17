import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { InputTextComponent } from 'src/app/core/components/basic/input-text/input-text.component';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { endDateNotBeforeStartDateValidator } from 'src/app/core/validators/date-validators';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import {
  DAYS_LIST,
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
export class RouteDetailComponent implements OnInit {
  @ViewChild(MatTable) flightTable: MatTable<any>;
  @ViewChild(InputTextComponent, { read: ElementRef })
  routeGenerator: ElementRef;

  public isLoading: boolean = false;

  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;

  public readonly routeMask = '000-000-000-000-000-000-000-000-000-000-000-000';
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
  private routeId: number;
  private fileRoute: FileRoute;
  private flightSearchFilter: SearchFilter = {};

  public routeForm: FormGroup = this.fb.group(
    {
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
      endDate: [{ value: '', disabled: true }, Validators.required],
      weekdays: [{ value: [], disabled: true }, Validators.required],
      monthDays: [{ value: [], disabled: true }, Validators.required],
      seatsF: [0, Validators.min(0)],
      seatsC: [0, Validators.min(0)],
      seatsY: [0, Validators.min(0)],
    },
    { validators: endDateNotBeforeStartDateValidator('startDate', 'endDate') }
  );

  public airportsControl: FormControl = this.fb.control('');

  public columnsToDisplay = [
    'origin',
    'destination',
    'departureTime',
    'arrivalTime',
  ];

  public paginatorLength: number = 0;
  public paginatorSize: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly airportsService: AirportsService,
    private readonly translateService: TranslateService,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRouteInfo();
    this.activateFormSubcriptions();
    this.loadSelectsData();
  }

  private getRouteInfo() {
    this.route.paramMap
      .pipe(
        tap((params) => (this.fileId = +params.get('fileId'))),
        tap((params) => (this.routeId = +params.get('routeId'))),
        switchMap((params) => this.route.data)
      )
      .subscribe((data) => {
        this.pageTitle = data.title;
        if (data.isRouteDetail) {
          this.getRouteDetail();
        }
      });
  }

  private getRouteDetail(): void {
    this.fileRouteService
      .getFileRouteById(this.fileId, this.routeId)
      .subscribe(this.initializeRouteFormForCopyRoute);
  }

  private initializeRouteFormForCopyRoute = (route: FileRoute): void => {
    this.routeForm.patchValue(route);
    this.routeForm.get('label').disable();
    this.routeForm.get('frequency').disable();
    this.airportsControl.disable();
  };

  private activateFormSubcriptions() {
    this.airportsControlValueChangesSubscribe();
    this.frequencyValueChangesSubscribe();
    this.startDateValueChangesSubscribe();
  }

  private airportsControlValueChangesSubscribe() {
    this.airportsControl.valueChanges
      .pipe(filter((airport: Airport) => !!airport?.iataCode))
      .subscribe(this.onAirportControlChanges);
  }

  private onAirportControlChanges = (airportSelected: Airport) => {
    debugger;
    const routeCode = this.routeForm.get('label').value;
    this.routeForm
      .get('label')
      .setValue(
        routeCode +
          this.getRouteCodeSeparator(routeCode) +
          airportSelected.iataCode
      );
    this.routeForm.get('label').updateValueAndValidity({ onlySelf: true });
    this.airportsControl.patchValue([]);
  };

  private getRouteCodeSeparator(routeCode: string): string {
    return this.isFirstAirport(routeCode) ? '' : '-';
  }

  private isFirstAirport(routeCode: string): boolean {
    return !!!routeCode;
  }

  private frequencyValueChangesSubscribe() {
    this.routeForm
      .get('frequency')
      .valueChanges.subscribe(this.onFrequencyChanges);
  }

  private onFrequencyChanges = (frequencyType: FrequencyType) => {
    this.enableAllFrequencyRelatedControls();
    switch (frequencyType) {
      case FrequencyType.ADHOC:
        this.resetAndDisableControl(this.routeForm.get('endDate'));
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
        this.resetAndDisableControl(this.routeForm.get('endDate'));
        this.resetAndDisableControl(this.routeForm.get('weekdays'));
        this.resetAndDisableControl(this.routeForm.get('monthDays'));
        break;
    }
  };

  private enableAllFrequencyRelatedControls() {
    this.routeForm.get('endDate').enable({ emitEvent: false });
    this.routeForm.get('weekdays').enable({ emitEvent: false });
    this.routeForm.get('monthDays').enable({ emitEvent: false });
  }

  private resetAndDisableControl(control: AbstractControl) {
    control.reset();
    control.disable();
  }

  private startDateValueChangesSubscribe() {
    this.routeForm
      .get('startDate')
      .valueChanges.pipe(filter((value) => value !== null))
      .subscribe(this.onStartDateChanges);
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

  private loadSelectsData() {
    this.loadFrequencies();
    this.loadWeekDays();
    this.loadAirports();
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
        this.weekDaysList = DAYS_LIST.map((weekDay: string) => {
          return {
            label: data[weekDay],
            value: weekDay,
          };
        });
      });
  }

  private loadAirports(): void {
    this.airports$ = concat(
      of([]), // default items
      this.airportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.airportsLoading = true)),
        switchMap(
          (term: string): Observable<Airport[]> =>
            this.airportsService.searchAirports(term).pipe(
              map((page: Page<Airport>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.airportsLoading = false))
            )
        )
      )
    );
  }

  public generateFlights() {
    if (!this.routeForm.valid) {
      this.routeForm.markAllAsTouched();
      return;
    }
    this.hasRouteAnyPassenger()
      ? this.createFileRoute()
      : this.confirmRouteNoPassengers();
  }

  private hasRouteAnyPassenger(): boolean {
    return (
      +this.getNumberOfPassengers(this.routeForm.get('seatsF')) +
        +this.getNumberOfPassengers(this.routeForm.get('seatsC')) +
        +this.getNumberOfPassengers(this.routeForm.get('seatsY')) >
      0
    );
  }

  private getNumberOfPassengers(control: AbstractControl): string {
    return control.value ?? '0';
  }

  private confirmRouteNoPassengers() {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'ROUTES.CONFIRM_GENERATION_TITLE',
          message: 'ROUTES.MSG_GENERATION_OPERATION',
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createFileRoute();
      }
    });
  }

  private createFileRoute() {
    this.fileRouteService
      .createFileRoute(
        this.fileId,
        this.createFilteRouteFromRouteForm(this.routeForm)
      )
      .pipe(
        tap((_) => (this.isLoading = true)),
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
    let { weekdays, monthDays, ...fileRoute } = routeForm.getRawValue();
    if (
      fileRoute?.frequency === '' ||
      fileRoute?.frequency === FrequencyType.ADHOC
    ) {
      fileRoute = {
        ...fileRoute,
        label: fileRoute.label.toUpperCase(),
        frequency: FrequencyType.ADHOC,
        endDate: fileRoute.startDate,
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
}
