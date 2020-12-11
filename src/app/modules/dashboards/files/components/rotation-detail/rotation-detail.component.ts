import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { TimeZone } from 'src/app/core/models/base/time-zone';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SortOrder } from 'src/app/core/models/table/sort-button/sort-by-column';
import { TimeConversionService } from 'src/app/core/services/time-conversion.service';
import { endDateNotBeforeStartDateValidator } from 'src/app/core/validators/date-validators';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { DAYS_LIST, FrequencyType, FREQUENCY_LIST } from '../../models/FileRoute.model';
import { Flight, FlightOrder } from '../../models/Flight.model';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-rotation-detail',
  templateUrl: './rotation-detail.component.html',
  styleUrls: ['./rotation-detail.component.scss']
})
export class RotationDetailComponent implements OnInit {
  public airports$: Observable<Airport[]>;
  public airportsInput$ = new Subject<string>();
  public airportsLoading = false;
  public dataSource = new MatTableDataSource<Flight>();
  public selection = new SelectionModel<Flight>(false, []);
  public frequencyList = [];
  public weekDaysList = [];
  public monthDaysList: number[];
  public pageTitle: string;
  private fileId: number;
  private rotationId: number;
  private flightSearchFilter: SearchFilter = {};
  public selectedFlight: Flight;
  public timeZones$: Observable<TimeZone[]>;
  public isFlightDataVisible: boolean = false;
  public isFlightDataReorderer: boolean = false;

  public rotationForm: FormGroup = this.fb.group({
    label: [ { value: '', disabled: true}],
    startDate: [{ value: '', disabled: true}],
    endDate: [{ value: '', disabled: true}],
  });

  public columnsToDisplay = ['selection', 'origin', 'destination', 'departureTime', 'arrivalTime', 'seatsF' , 'seatsC',
  'seatsY', 'actions'
  ];

  public paginatorLength: number = 0;
  public paginatorSize: number = 0;

  public flightForm: FormGroup = this.fb.group({
    id: [null],
    order: [null],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: [null, Validators.required],
    departureTime: [null, Validators.required],
    arrivalDate: [null, Validators.required],
    arrivalTime: [null, Validators.required],
    timeZone: [null, Validators.required],
    seatsF: ['', Validators.min(0)],
    seatsC: ['', Validators.min(0)],
    seatsY: ['', Validators.min(0)],
    beds: ['', Validators.min(0)],
    stretchers: ['', Validators.min(0)],
  }, { validators: endDateNotBeforeStartDateValidator('departureDate', 'arrivalDate')});

  constructor(
    private readonly fb: FormBuilder,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly timeConversionService: TimeConversionService,
    private readonly airportsService: AirportsService,
    private readonly matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.flightSearchFilter['sort'] = `order,${SortOrder.ASC}`;
    this.getRouteInfo();
    this.loadSelectsData();
  }

  private getRouteInfo() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
      this.rotationId = +params.get('rotationId');
      this.refreshScreenData();
    });
    this.route.data.subscribe((data) => {
      this.pageTitle = data.title;
    });
  }

  private refreshScreenData() {
    this.selectedFlight = undefined;
    this.selection.clear();
    this.hideReorderButton();
    this.hideFlightData();
    this.getRotationData();
    this.getFlightData();
  }

  private getRotationData(): void {
    this.fileRouteService.getFileRouteById(this.fileId, this.rotationId)
    .subscribe(rotation => this.rotationForm.patchValue(rotation));
  }

  private getFlightData() {
    this.flightService
    .getFlights(this.fileId, this.rotationId, this.flightSearchFilter)
    .subscribe(this.updateFlightData);
  }

  private loadSelectsData() {
    this.loadAirports();
    this.loadFrequencies();
    this.loadWeekDays();
    this.loadTimeZones();
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

  private loadTimeZones(): void {
    this.timeZones$ = this.timeConversionService.getTimeZones();
  }


  private updateFlightData = (flights: Page<Flight>) => {
    this.dataSource = new MatTableDataSource<Flight>(flights.content);
    this.paginatorLength = flights.totalElements;
    this.paginatorSize = flights.size;
  };

  public getReturnRoute() {
    return `/files/${this.fileId}`;
  }

  public onPage(pageEvent: PageEvent) {
    this.flightSearchFilter['page'] = pageEvent.pageIndex.toString();
    this.flightSearchFilter['size'] = pageEvent.pageSize.toString();
    this.getFlightData();
  }

  public onFlightSelected(flight: Flight) {
    this.selection.toggle(flight);
    this.selectedFlight = this.selection.isEmpty()? undefined : flight;
    if(this.selection.isEmpty()) {
      this.hideFlightData();
    }else {
      this.flightForm.reset();
      this.updateFlightForm();
      this.showFlightData();
    }
  }

  private updateFlightForm() {
    const {departureTime: departureDateTime, arrivalTime: arrivaleDateTime, ...flightWithoutDepartureTime} = this.selectedFlight;
    const [departureDate, departureTime] = typeof departureDateTime === 'string'? departureDateTime.split(' ') : [null, null];
    const [arrivalDate, arrivalTime] = typeof arrivaleDateTime === 'string'? arrivaleDateTime.split(' ') : [null, null];;
    this.flightForm.patchValue({ ...flightWithoutDepartureTime, departureDate, departureTime, arrivalDate, arrivalTime });
  }

  public deleteFlight(flight: Flight) {
    const confirmOperationRef = this.matDialog.open(ConfirmOperationDialogComponent, {
      data: {
        title: 'ROTATIONS.DELETE_FLIGHT_TITLE',
        message: 'ROTATIONS.DELETE_FLIGHT_MSG',
        translationParams: {
          origin: flight.origin.iataCode,
          destination: flight.destination.iataCode,
          departureTime: flight.departureTime
        }
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        this.flightService.deleteFlight(this.fileId, this.rotationId, flight).subscribe(_ => this.refreshScreenData());
      }
    });
  }

  public editFlight() {
    if (!this.flightForm.valid) {
      this.flightForm.markAllAsTouched();
      return;
    }
    this.flightService.updateFlight(this.fileId, this.rotationId, this.createFlightFromFlightFormValue(this.flightForm.value))
    .subscribe((flight: Flight)=> {
      this.refreshScreenData();
    });
  }

  public createFlight() {
    if (!this.flightForm.valid) {
      this.flightForm.markAllAsTouched();
      return;
    }
    this.flightService.createFlight(this.fileId, this.rotationId, this.createFlightFromFlightFormValue(this.flightForm.value))
    .subscribe((flight: Flight)=> {
      this.selectedFlight = undefined;
      this.refreshScreenData();
    });
  }

  private createFlightFromFlightFormValue(flightFormValue: any): Flight {
    const {departureTime, departureDate, arrivalDate, arrivalTime, origin, destination, ...flightData} = flightFormValue;

    return {
      ...flightData,
      departureTime: departureDate + ' ' + departureTime,
      arrivalTime: arrivalDate + ' ' + arrivalTime,
      originId: origin.id,
      destinationId: destination.id
    };
  }

  public newFlight(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selection.clear();
    this.showFlightData();
    this.flightForm.reset();
  }

  public dropRowFlight(event: CdkDragDrop<Flight[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource = new MatTableDataSource<Flight>(this.dataSource.data)
    this.showReorderButton();
  }

  public reorderFlights() {
    this.flightService.reorderFlights(this.fileId, this.rotationId, this.getFlightsOrder(this.dataSource.data))
      .subscribe(_ => this.refreshScreenData());
  }

  public getFlightsOrder(flights: Flight[]): FlightOrder[] {
    return flights.map((flight: Flight, index: number) => ({ id: flight.id, order: index + 1 }));
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

  private showReorderButton(): void {
    this.isFlightDataReorderer = true;
  }

  private hideReorderButton(): void {
    this.isFlightDataReorderer = false;
  }

  private showFlightData(): void {
    this.isFlightDataVisible = true;
  }

  private hideFlightData(): void {
    this.isFlightDataVisible = false;
  }
}
