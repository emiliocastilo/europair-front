import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TimeZone } from 'src/app/core/models/base/time-zone';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { TimeConversionService } from 'src/app/core/services/time-conversion.service';
import { DAYS_LIST, FileRoute, FrequencyType, FREQUENCY_LIST } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-rotation-detail',
  templateUrl: './rotation-detail.component.html',
  styleUrls: ['./rotation-detail.component.scss']
})
export class RotationDetailComponent implements OnInit {
  public isLoading: boolean = false;

  public dataSource = new MatTableDataSource<Flight>();
  public selection = new SelectionModel<Flight>(false, []);
  public frequencyList = [];
  public weekDaysList = [];
  public monthDaysList: number[];
  public pageTitle: string;
  private fileId: number;
  private rotationId: number;
  private rotation: FileRoute;
  private flightSearchFilter: SearchFilter = {};
  public selectedFlight: Flight;
  public timeZones$: Observable<TimeZone[]>;


  public rotationForm: FormGroup = this.fb.group({
    label: [ { value: '', disabled: true}],
    frequency: [{ value: '', disabled: true}],
    startDate: [{ value: '', disabled: true}],
    endDate: [{ value: '', disabled: true}],
    weekdays: [{ value: [], disabled: true }],
    monthDays: [{ value: [], disabled: true }],
  });

  public columnsToDisplay = [
    { title: '', label: 'selection', isCheckbox: true},
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

  public flightForm: FormGroup = this.fb.group({
    id: [null],
    origin: [ { value: '', disabled: true}],
    destination: [{ value: '', disabled: true}],
    departureDate: [null, [Validators.required, this.getDepartureDateNotBeforeValidator()]],
    departureTime: [null, Validators.required],
    timeZone: [null, Validators.required],
    seatsF: ['', Validators.min(0)],
    seatsC: ['', Validators.min(0)],
    seatsY: ['', Validators.min(0)],
    beds: ['', Validators.min(0)],
    stretchers: ['', Validators.min(0)],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly timeConversionService: TimeConversionService
  ) {}

  ngOnInit(): void {
    this.getRouteInfo();
    this.loadSelectsData();
  }

  private getRouteInfo() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
      this.rotationId = +params.get('rotationId');
      this.getRotationData(this.fileId, this.rotationId);
      this.getFlightData(this.fileId, this.rotationId);
    });
    this.route.data.subscribe((data) => {
      this.pageTitle = data.title;
    });
  }

  private getRotationData(fileId: number, rotationId: number): void {
    this.fileRouteService.getFileRouteById(fileId, rotationId)
    .pipe(
      tap(rotation => this.rotation = rotation)
    )
    .subscribe(rotation => this.rotationForm.patchValue(rotation));
  }

  private getFlightData(fileId: number, rotationId: number) {
    this.flightService
    .getFlights(fileId, rotationId)
    .subscribe(this.updateFlightData);
  }

  private loadSelectsData() {
    this.loadFrequencies();
    this.loadWeekDays();
    this.loadTimeZones();
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
    this.flightService
      .getFlights(this.fileId, this.rotationId, this.flightSearchFilter)
      .subscribe(this.updateFlightData);
  }

  public onFlightSelected(flight: Flight) {
    this.selection.toggle(flight);
    this.selectedFlight = this.selection.isEmpty()? undefined : flight;
    if(!this.selection.isEmpty()) {
      this.flightForm.reset();
      this.updateFlightForm();
    }
  }

  private updateFlightForm() {
    const {departureTime: departureDateTime, ...flightWithoutDepartureTime} = this.selectedFlight;
    const [departureDate, departureTime] = departureDateTime.split(' ');
    this.flightForm.patchValue({...flightWithoutDepartureTime, departureDate, departureTime});
  }

  public saveFlight() {
    if (!this.flightForm.valid) {
      this.flightForm.markAllAsTouched();
      return;
    }
    this.flightService.updateFlight(this.fileId, this.rotationId, this.createFlightFromFlightFormValue(this.flightForm.value))
    .subscribe((flight: Flight)=> {
      this.selectedFlight = undefined;
      this.getFlightData(this.fileId, this.rotationId);
    });
  }

  private createFlightFromFlightFormValue(flightFormValue: any): Flight {
    const {departureTime, departureDate, ...flightData} = flightFormValue;

    return {
      ...flightData,
      departureTime: departureDate + ' ' + departureTime,
      origin: this.selectedFlight.origin,
      destination: this.selectedFlight.destination
    };
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

  public getDepartureDateNotBeforeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.isFlightDepartureDateBeforeThanRotationStartDate(control.value)
        ? { dateBeforeLimit: { value: control.value } }
        : null;
    };
  }

  private isFlightDepartureDateBeforeThanRotationStartDate(departureDate: string): boolean {
    if (this.rotation && departureDate) {
      const rotationStartDate = new Date(this.rotation.startDate);
      const flightDepartureDate = new Date(departureDate);
      return flightDepartureDate.getTime() < rotationStartDate.getTime();
    } else {
      return false;
    }

  }
}
