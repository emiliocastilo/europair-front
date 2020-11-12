import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ServiceType } from '../../../masters/services/models/services.model';
import {
  ContributionLine,
  RotationContributionLine,
} from '../../models/ContributionLine.model';
import { FileRoute } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { ContributionLineService } from '../../services/contribution-line.service';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-contribution-line-detail',
  templateUrl: './contribution-line-detail.component.html',
  styleUrls: ['./contribution-line-detail.component.scss'],
})
export class ContributionLineDetailComponent implements OnInit {
  public fileId: number;
  public routeId: number;
  public contributionId: number;
  public lineId: number;
  public flightPriceControls: FormArray;
  public flightColumnsToDisplay = ['flight', 'price'];
  public flightContributionLines: RotationContributionLine[] = [];
  public flightLinesTotalPrice: number = 0;
  private flightsLinesMap: Map<number, ContributionLine> = new Map();
  private datePipe: DatePipe;
  public rotationContributionLine: ContributionLine;
  private currentRotation: FileRoute;

  public rotationForm: FormGroup = this.fb.group({
    rotation: [{ value: '', disabled: true }],
    price: [{ value: '', disabled: true }],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly routesService: FileRoutesService,
    private readonly contributionLineService: ContributionLineService,
    private readonly flightService: FlightService,
    private readonly fb: FormBuilder,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.datePipe = new DatePipe(locale);
  }

  ngOnInit(): void {
    this.initializeScreen();
  }

  private initializeScreen() {
    this.getRouteData();
  }

  private getRouteData() {
    this.route.paramMap.subscribe((params) => {
      this.fileId = +params.get('fileId');
      this.routeId = +params.get('routeId');
      this.contributionId = +params.get('contributionId');
      this.lineId = +params.get('lineId');
      this.refreshScreenData();
    });
  }

  private refreshScreenData() {
    this.contributionLineService
      .getContributionLineById(
        this.fileId,
        this.routeId,
        this.contributionId,
        this.lineId
      )
      .pipe(
        tap((line) => (this.rotationContributionLine = line)),
        tap((line) =>
          this.rotationForm.patchValue({ price: this.maskPrice(line.price) })
        ),
        switchMap((line) =>
          this.routesService.getFileRouteById(this.fileId, line.routeId)
        ),
        tap((rotation) => (this.currentRotation = rotation)),
        tap((rotation) =>
          this.rotationForm.patchValue({
            rotation: `${rotation.label} ${this.datePipe.transform(
              rotation.endDate,
              'dd/MM/yyyy'
            )}`,
          })
        ),
        switchMap((rotation) => this.refreshFlightLinesTable$(rotation))
      )
      .subscribe(([flights, lines]) =>
        this.createFlightPriceControls(flights, lines)
      );
  }

  private refreshFlightLinesTable$(
    rotation: FileRoute
  ): Observable<[Flight[], ContributionLine[]]> {
    return combineLatest([
      this.flightService
        .getFlights(this.fileId, rotation.id, {
          size: '1000',
          sort: 'order',
        })
        .pipe(map((page) => page.content)),
      this.contributionLineService
        .getContributionLines(this.fileId, this.routeId, this.contributionId, {
          'filter_flight.routeId': rotation.id.toString(),
          filter_lineContributionRouteType: this.rotationContributionLine
            .lineContributionRouteType,
          size: '1000',
        })
        .pipe(map((page) => page.content)),
    ]);
  }

  private createFlightPriceControls(
    flights: Flight[],
    lines: ContributionLine[]
  ): void {
    this.flightLinesTotalPrice = this.contributionLineService.getTotalPrice(
      lines
    );
    this.flightContributionLines = this.createFlightLines(flights, lines);
    this.flightPriceControls = new FormArray(
      this.flightContributionLines.map(this.createPriceControls)
    );
  }

  private createFlightLines(
    flights: Flight[],
    lines: ContributionLine[]
  ): RotationContributionLine[] {
    return flights.map((flight) =>
      this.createRotationLinesFromFlights(flight, lines)
    );
  }

  private createRotationLinesFromFlights(
    flight: Flight,
    lines: ContributionLine[]
  ): RotationContributionLine {
    this.flightsLinesMap = new Map(lines.map((line) => [line.flightId, line]));
    return {
      contributionLine: this.getContributionLine(
        this.flightsLinesMap.get(flight.id),
        flight
      ),
      rotation: `${flight.origin.iataCode}-${
        flight.destination.iataCode
      } ${this.datePipe.transform(flight.departureTime, 'dd/MM/yyyy HH:mm')}`,
      price: this.getPriceFromContributionLine(
        this.flightsLinesMap.get(flight.id)
      ),
    };
  }

  private getContributionLine(
    line: ContributionLine | undefined,
    flight: Flight
  ): ContributionLine {
    return (
      line ?? {
        id: null,
        contributionId: this.rotationContributionLine.contributionId,
        routeId: this.rotationContributionLine.routeId,
        flightId: flight.id,
        comments: null,
        price: 0,
        lineContributionRouteType: this.rotationContributionLine
          .lineContributionRouteType,
        type: ServiceType.FLIGHT,
      }
    );
  }

  private getPriceFromContributionLine(
    line: ContributionLine | undefined
  ): number {
    return line?.price ?? 0;
  }

  private createPriceControls = (
    flightContributionLine: RotationContributionLine
  ): FormGroup => {
    return new FormGroup({
      price: new FormControl(flightContributionLine.price),
    });
  };

  public updateFlightPrice(index: number, field: string) {
    const control = this.getControl(this.flightPriceControls, index, field);
    console.log(
      this.getContributionLinePriceUpdated(
        this.flightContributionLines[index],
        control
      )
    );
    if (control.valid && control.dirty) {
      this.saveFlightContributionLine$(
        this.getContributionLinePriceUpdated(
          this.flightContributionLines[index],
          control
        )
      )
        .pipe(
          switchMap(() => this.refreshFlightLinesTable$(this.currentRotation))
        )
        .subscribe(([flights, lines]) =>
          this.createFlightPriceControls(flights, lines)
        );
    }
  }

  private saveFlightContributionLine$(
    line: ContributionLine
  ): Observable<void | number> {
    return line.id
      ? this.contributionLineService.updateContributionLine(
          this.fileId,
          this.routeId,
          this.contributionId,
          line
        )
      : this.contributionLineService.createContributionLine(
          this.fileId,
          this.routeId,
          this.contributionId,
          line
        );
  }

  private getContributionLinePriceUpdated(
    rotationContributionLine: RotationContributionLine,
    control: FormControl
  ): ContributionLine {
    return {
      ...rotationContributionLine.contributionLine,
      price: control.value,
    };
  }

  public getControl(
    controlsArray: FormArray,
    index: number,
    fieldName: string
  ): FormControl {
    return controlsArray.at(index).get(fieldName) as FormControl;
  }

  private maskPrice(price: number): string {
    return (
      price
        ?.toString()
        ?.replace('.', ',')
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') ?? '0'
    );
  }
}
