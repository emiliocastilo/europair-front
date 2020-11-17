import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { AirportsService } from 'src/app/modules/dashboards/masters/airports/services/airports.service';
import { Flight } from '../../../../models/Flight.model';
import { FlightsService } from '../../services/flights.service';

@Component({
  selector: 'app-tracking-detail',
  templateUrl: './flight-tracking-detail.component.html',
  styleUrls: ['./flight-tracking-detail.component.scss'],
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
export class FlightTrackingDetailComponent implements OnInit {
  public pageTitle: string;

  public flight: Flight;

  public originAirports$: Observable<Airport[]>;
  public originAirportsInput$ = new Subject<string>();
  public originAirportsLoading = false;

  public destinationAirports$: Observable<Airport[]>;
  public destinationAirportsInput$ = new Subject<string>();
  public destinationAirportsLoading = false;

  public flightId: number;

  public flightForm: FormGroup = this.fb.group({
    id: [null],
    order: [null],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: ['', Validators.required],
    departureTime: ['', Validators.required],
    arrivalDate: ['', Validators.required],
    arrivalTime: ['', Validators.required],
    realDepartureDate: [''],
    realDepartureTime: [''],
    realArrivalDate: [''],
    realArrivalTime: [''],
    seatsF: ['', Validators.min(0)],
    seatsC: ['', Validators.min(0)],
    seatsY: ['', Validators.min(0)],
    flightNumber: [''],
    slot: [''],
    parking: [''],
    paxAdult: [''],
    paxChildren: [''],
    paxInfants: ['']
  });

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
    private readonly flightService: FlightsService,
    private readonly matDialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.obtainParams();
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
    this.route.params.subscribe((params: { flightId: string }) => {
      this.obtainFlight(params.flightId);
    });
  }

  public obtainFlight(flightId: string): void {
    this.flightService.getFlightById(flightId)
      .subscribe((flight: Flight) => this.selectFlight(flight));
  }

  // TODO: improve patchValue

  public patchFlightForm(flight: Flight) {
    if (flight) {
      const {
        departureTime: departureDateTime,
        arrivalTime: arrivalDateTime,
        realDepartureTime: realDepartureDateTime,
        realArrivalTime: realArrivalDateTime,
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
      const [realDepartureDate, realDepartureTime] =
        typeof realDepartureDateTime === 'string'
          ? realDepartureDateTime.split(' ')
          : [null, null];
      const [realArrivalDate, realArrivalTime] =
        typeof realArrivalDateTime === 'string'
          ? realArrivalDateTime.split(' ')
          : [null, null];
      this.flightForm.patchValue({
        ...flightWithoutDepartureTime,
        departureDate,
        departureTime,
        arrivalDate,
        arrivalTime,
        realDepartureDate,
        realDepartureTime,
        realArrivalDate,
        realArrivalTime
      });
    } else {
      this.flightForm.reset();
    }
    this.flightForm.markAsUntouched();
  }

  public getDate(date: string, format: string) {
    return date ? this.datePipe.transform(new Date(date), format) : '';
  }

  public getSeatsFCY(element: Flight): string {
    return `${element.seatsF}/${element.seatsC}/${element.seatsY}`;
  }

  public selectFlight(flight: Flight) {
    this.flight = flight;
    this.patchFlightForm(flight);
  }

  public navigateBack() {
    this.router.navigate(['files/flight-tracking']);
  }

  public saveFlight() {
    if (!this.flightForm.valid) {
      this.flightForm.markAllAsTouched();
      return;
    }
    const msgConfirmation: string = this.getConfirmationMsg();
    if (msgConfirmation !== '') {
      const confirmOperationRef = this.matDialog.open(
        ConfirmOperationDialogComponent,
        {
          data: {
            title: 'FLIGHT_TRACKING.CONFIRM_UPDATE_FLIGHT',
            message: msgConfirmation/*,
            translationParams: {
              type: service.type,
              price: service.price,
            },*/
          },
        }
      );
      confirmOperationRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateFlight();
        }
      });
    } else {
      this.updateFlight();
    }
  }


  private updateFlight() {
    const {
      departureTime,
      departureDate,
      arrivalDate,
      arrivalTime,
      realDepartureTime,
      realDepartureDate,
      realArrivalDate,
      realArrivalTime,
      origin,
      destination,
      ...flightData
    } = this.flightForm.value;

    const flight = {
      ...flightData,
      departureTime: departureDate + ' ' + departureTime,
      arrivalTime: arrivalDate + ' ' + arrivalTime,
      realDepartureTime: realDepartureDate + ' ' + realDepartureTime,
      realArrivalTime: realArrivalDate + ' ' + realArrivalTime,
      originId: origin.id,
      destinationId: destination.id,
    };

    this.flightService
      .updateFlight(flight)
      .subscribe();
  }

  private getConfirmationMsg(): string {
    const confirmationSeats: boolean = this.needUpdateSeatsConfirmation();
    const confirmationDatetime: boolean = this.needUpdateDatetimeConfirmation();
    let confirmationMsg: string = '';

    if (confirmationDatetime || confirmationSeats) {
      if (confirmationDatetime && confirmationSeats) {
        confirmationMsg = 'FLIGHT_TRACKING.CONFIRM_UPDATE_FLIGHT_MSG';
      } else {
        confirmationMsg = confirmationDatetime ? 'FLIGHT_TRACKING.CONFIRM_UPDATE_FLIGHT_MSG_DATE' : 'FLIGHT_TRACKING.CONFIRM_UPDATE_FLIGHT_MSG_SEAT';
      }
    }

    return confirmationMsg;
  }

  private needUpdateDatetimeConfirmation(): boolean {
    return this.flightForm.get('departureTime').touched || this.flightForm.get('departureDate').touched || this.flightForm.get('arrivalDate').touched ||
    this.flightForm.get('arrivalTime').touched || this.flightForm.get('realDepartureTime').touched || this.flightForm.get('realDepartureDate').touched ||
    this.flightForm.get('realArrivalDate').touched || this.flightForm.get('realArrivalTime').touched;
  }

  private needUpdateSeatsConfirmation(): boolean {
    return  this.flightForm.get('seatsC').touched ||
      this.flightForm.get('seatsF').touched ||
      this.flightForm.get('seatsY').touched;
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
