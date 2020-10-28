import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { Airport } from '../../../masters/regions/models/airport';
import { FileRoute, RouteStatus } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-tracking-detail',
  templateUrl: './tracking-detail.component.html',
  styleUrls: ['./tracking-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TrackingDetailComponent implements OnInit {
  public pageTitle: string;

  public flightData: Flight;

  public originAirports$: Observable<Airport[]>;
  public originAirportsInput$ = new Subject<string>();
  public originAirportsLoading = false;

  public destinationAirports$: Observable<Airport[]>;
  public destinationAirportsInput$ = new Subject<string>();
  public destinationAirportsLoading = false;

  public routes: Array<FileRoute> = [];
  public routesToDisplay: Array<any> = [];
  public rotations: Array<FileRoute> = [];
  public providers: Array<Provider> = [];
  public flights: Array<Flight> = [];

  public fileId: number;
  public routeId: number;
  public rotationId: number;
  public flightId: number;

  public expandedElement: FileRoute | null;

  public flightForm: FormGroup = this.fb.group({
    id: [null],
    order: [null],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: ['', Validators.required],
    departureTime: ['', Validators.required],
    arrivalDate: ['', Validators.required],
    arrivalTime: ['', Validators.required],
    seatsF: ['', Validators.min(0)],
    seatsC: ['', Validators.min(0)],
    seatsY: ['', Validators.min(0)],
    flightNumber: [''],
    slot: [''],
    parking: [''],
  });

  public columnsToDisplay = [
    'label',
    'origin',
    'destination',
    'departureDate',
    'departureTime',
    'arrivalDate',
    'arrivalTime',
    'seatsF',
    'seatsC',
    'seatsY',
    'flightNumber',
    'slot',
    'parking',
  ];

  // TODO: enum + i18n
  public commonStatus = [{ label: 'PENDING' }, { label: 'CONFIRMED' }];

  public isSmallScreen: Observable<
    BreakpointState
  > = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]);

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly airportsService: AirportsService,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.obtainParams();
    this.obtainRoute();
    this.loadAirports();
  }

  private loadAirports(): void {
    this.originAirports$ = concat(
      of([]), // default items
      this.originAirportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.originAirportsLoading = true)),
        switchMap(
          (term: string): Observable<Airport[]> =>
            this.airportsService.searchAirports(term).pipe(
              map((page: Page<Airport>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.originAirportsLoading = false))
            )
        )
      )
    );

    this.destinationAirports$ = concat(
      of([]), // default items
      this.destinationAirportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.destinationAirportsLoading = true)),
        switchMap(
          (term: string): Observable<Airport[]> =>
            this.airportsService.searchAirports(term).pipe(
              map((page: Page<Airport>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.destinationAirportsLoading = false))
            )
        )
      )
    );
  }

  private obtainParams(): void {
    this.route.params.subscribe((params: { fileId: string }) => {
      this.fileId = parseInt(params.fileId, 10);
    });
  }

  private obtainRoute(): void {
    const filter = {
      filter_routeState: RouteStatus.WON,
    };
    this.fileRouteService
      .getFileRoutes(this.fileId, filter)
      .subscribe((filePage: Page<FileRoute>) => {
        this.routes = filePage.content;
        if (this.routes?.length === 1) {
          const routeId: number = this.routes[0].id;
          this.obtainRotation(routeId);
        }
      });
  }

  public obtainRotation(routeId: number): void {
    this.routeId = routeId;
    this.rotations = this.routes.find(
      (route: FileRoute) => route.id === routeId
    ).rotations;
    this.selectFlight(null);
    if (this.rotations?.length === 1) {
      const rotationId = this.rotations[0].id;
      this.obtainFlights(rotationId);
    }
  }

  public obtainFlights(rotationId: number): void {
    if (!rotationId) {
      return;
    }
    this.rotationId = rotationId;
    this.flightService
      .getFlights(this.fileId, this.rotationId)
      .subscribe((flightsPage: Page<Flight>) => {
        this.flights = flightsPage.content.map((flight: Flight) => {
          return {
            ...flight,
            description: `${flight.origin.iataCode} - ${flight.destination.iataCode}`,
          };
        });
      });
  }

  // TODO: improve patchValue

  public patchFlightForm(flight: Flight) {
    if (flight) {
      const {
        departureTime: departureDateTime,
        arrivalTime: arrivalDateTime,
        ...flightWithoutDepartureTime
      } = flight;
      const [departureDate, departureTime] =
        typeof departureDateTime === 'string'
          ? departureDateTime.split(' ')
          : [null, null];
      const [arrivalDate, arrivalTime] =
        typeof arrivalDateTime === 'string'
          ? arrivalDateTime.split(' ')
          : [null, null];
      this.flightForm.patchValue({
        ...flightWithoutDepartureTime,
        departureDate,
        departureTime,
        arrivalDate,
        arrivalTime,
      });
    } else {
      this.flightForm.reset();
    }
    this.flightForm.markAsUntouched();
  }

  public getDate(date: string, format: string) {
    return date ? this.datePipe.transform(new Date(date), format) : '';
  }

  public expandRow(element: FileRoute) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.obtainFlights(element.id);
  }

  public selectFlight(flightId: number) {
    this.flightId = flightId ? flightId : null;
    const selectedFlight = this.flights.find(
      (flight: Flight) => flight.id === this.flightId
    );
    this.flightData = selectedFlight;
    this.patchFlightForm(selectedFlight);
  }

  public navigateBack() {
    this.router.navigate(['files/tracking']);
  }

  public saveFlight() {
    if (!this.flightForm.valid) {
      this.flightForm.markAllAsTouched();
      return;
    }

    const {
      departureTime,
      departureDate,
      arrivalDate,
      arrivalTime,
      origin,
      destination,
      ...flightData
    } = this.flightForm.value;

    const flight = {
      ...flightData,
      departureTime: departureDate + ' ' + departureTime,
      arrivalTime: arrivalDate + ' ' + arrivalTime,
      originId: origin.id,
      destinationId: destination.id,
    };

    this.flightService
      .updateFlight(this.fileId, this.rotationId, flight)
      .subscribe(() => {
        this.obtainFlights(this.rotationId);
      });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.flightForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.flightForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public isControlDisabled(controlName: string): boolean {
    const control = this.flightForm.get(controlName);
    return control?.disabled;
  }
}
