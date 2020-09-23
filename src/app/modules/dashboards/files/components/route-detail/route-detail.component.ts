import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { InputTextComponent } from 'src/app/core/components/basic/input-text/input-text.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport } from '../../../masters/airports/models/airport';
import { AirportsService } from '../../../masters/airports/services/airports.service';
import { FrequencyType, FREQUENCY_LIST } from '../../models/FileRoute.model';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss'],
})
export class RouteDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) flightTable: MatTable<any>;
  @ViewChild(InputTextComponent, { read: ElementRef })
  routeGenerator: ElementRef;

  public routeCode = '';

  public originAirports$: Observable<Airport[]>;
  public originAirportsInput$ = new Subject<string>();
  public originAirportsLoading = false;
  public originAirportIdSelected: string;

  public destinationAirports$: Observable<Airport[]>;
  public destinationAirportsInput$ = new Subject<string>();
  public destinationAirportsLoading = false;
  public destinationAirportIdSelected: string;

  private mockedFlights = [
    {
      origin: 'MAD',
      destination: 'PMI',
      startDate: '02/10/20',
      endDate: '02/10/20',
      startTime: '13:00',
      endTime: '14:30',
      seatsF: 50,
      seatsC: 0,
      seatsY: 0,
      ferry: false,
    },
    {
      origin: 'PMI',
      destination: 'MAD',
      startDate: '02/10/20',
      endDate: '02/10/20',
      startTime: '15:00',
      endTime: '16:30',
      seatsF: 50,
      seatsC: 0,
      seatsY: 0,
      ferry: false,
    },
  ];

  public dataSource = new MatTableDataSource<any>(this.mockedFlights);
  public frequencyList = [];

  public routeForm: FormGroup = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    frequency: ['', Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endDate: ['', Validators.required],
    endTime: ['', Validators.required],
    seatsF: ['', Validators.required],
    seatsC: ['', Validators.required],
    seatsY: ['', Validators.required],
    ferry: ['', Validators.required],
  });

  public columnsToDisplay = [
    { title: 'Aeropuerto Origen', label: 'origin' },
    { title: 'Aeropuerto Origen', label: 'destination' },
    { title: 'Fecha inicio', label: 'startDate' },
    { title: 'Fecha fin', label: 'endDate' },
    { title: 'Hora inicio', label: 'startTime' },
    { title: 'Hora fin', label: 'endTime' },
    { title: 'Asientos F', label: 'seatsF' },
    { title: 'Asientos C', label: 'seatsC' },
    { title: 'Asientos Y', label: 'seatsY' },
    { title: 'Ferry', label: 'ferry' },
  ];

  public columnsProps = this.columnsToDisplay.map((e) => e.label);

  constructor(
    private readonly fb: FormBuilder,
    private readonly airportsService: AirportsService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadOriginAirports();
    this.loadDestinationAirports();
    this.loadFrequencies();
  }

  ngAfterViewInit(): void {}

  private loadOriginAirports(): void {
    this.originAirports$ = concat(
      of([]), // default items
      this.originAirportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.originAirportsLoading = true)),
        switchMap(
          (term: string): Observable<Airport[]> => {
            const filter = { filter_name: term };
            return this.airportsService.getAirports(filter).pipe(
              map((page: Page<Airport>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.originAirportsLoading = false))
            );
          }
        )
      )
    );
  }

  private loadDestinationAirports(): void {
    this.destinationAirports$ = concat(
      of([]), // default items
      this.destinationAirportsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.destinationAirportsLoading = true)),
        switchMap(
          (term: string): Observable<Airport[]> => {
            const filter = { filter_name: term };
            return this.airportsService.getAirports(filter).pipe(
              map((page: Page<Airport>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.destinationAirportsLoading = false))
            );
          }
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

  public generateFlights() {
    // const routeSegments = this.routeCode.split('-').map((e) => e.toUpperCase());
    // routeSegments.forEach((segment, i) => {
    //   if (routeSegments[i + 1]) {
    //     this.dataSource.data.push({
    //       ...this.defaultFlight,
    //       origin: segment,
    //       destination: routeSegments[i + 1],
    //     });
    //   }
    //   if (routeSegments[i - 1]) {
    //     this.dataSource.data.push({
    //       ...this.defaultFlight,
    //       origin: segment,
    //       destination: routeSegments[i - 1],
    //     });
    //   }
    // });
    // this.flightTable.renderRows();
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
}
