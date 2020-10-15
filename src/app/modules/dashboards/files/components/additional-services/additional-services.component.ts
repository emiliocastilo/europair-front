import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, of, Operator, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { InputTextComponent } from 'src/app/core/components/basic/input-text/input-text.component';
import { Page } from 'src/app/core/models/table/pagination/page';
import { AdditionalService } from '../../models/AdditionalService.model';
import { Provider } from '../../models/File.model';
import { FileRoute } from '../../models/FileRoute.model';
import { Flight } from '../../models/Flight.model';
import { Services } from '../../models/Services.model';
import { AdditionalServiceService } from '../../services/additional-services.service';
import { FileRoutesService } from '../../services/file-routes.service';
import { FlightService } from '../../services/flight.service';
import { ProviderService } from '../../services/provider.service';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-additional-services',
  templateUrl: './additional-services.component.html',
  styleUrls: ['./additional-services.component.scss'],
})
export class AdditionalServicesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) flightTable: MatTable<any>;
  @ViewChild(InputTextComponent, { read: ElementRef })
  routeGenerator: ElementRef;

  public pageTitle: string;
  public routes: Array<FileRoute>;
  public rotations: Array<FileRoute>;
  public providers: Array<Provider>;
  public flights: Array<Flight>;
  private fileId: number;
  private routeId: number;
  private rotationId: number;

  public services$: Observable<Services[]>;
  public servicesInput$ = new Subject<string>();
  public servicesLoading = false;

  public isLoading: boolean;

  public additionalServicesForm: FormGroup = this.fb.group({
    route: ['', Validators.required],
    rotation: ['', Validators.required],
    flights: [[]],
    description: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    provider: ['', Validators.required],
    purchasePrice: ['', [Validators.required, Validators.min(0)]],
    salePrice: ['', [Validators.required, Validators.min(0)]],
    services: ['', Validators.required],
    observation: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fileRouteService: FileRoutesService,
    private readonly flightService: FlightService,
    private readonly providerService: ProviderService,
    private readonly additionalServicesService: AdditionalServiceService,
    private readonly servicesService: ServicesService
  ) { }

  ngOnInit(): void {
    this.routes = [];
    this.rotations = [];
    this.flights = [];
    this.obtainParams();
    this.obtainRoute();
    this.obtainProviders();
    this.loadServices();
  }

  ngAfterViewInit(): void { }

  private obtainParams(): void {
    this.route.params.subscribe((params: { fileId: string }) => {
      this.fileId = parseInt(params.fileId, 10);
    });
  }

  private obtainRoute(): void {
    this.fileRouteService.getFileRoutes(this.fileId)
      .subscribe((filePage: Page<FileRoute>) => {
        this.routes = filePage.content;
        if (this.routes?.length === 1) {
          const routeId: number = this.routes[0].id;
          this.additionalServicesForm.get('route').setValue(routeId);
          this.obtainRotation(routeId);
        }
      });
  }

  public obtainRotation(routeId: number): void {
    this.routeId = routeId;
    this.rotations = this.routes.find((route: FileRoute) => route.id === routeId).rotations;
    this.additionalServicesForm.get('rotation').reset();
    this.additionalServicesForm.get('flights').reset();
    if (this.rotations?.length === 1) {
      const rotationId = this.rotations[0].id;
      this.additionalServicesForm.get('rotation').setValue(rotationId);
      this.obtainFlights(rotationId);
    }
  }

  public obtainFlights(rotationId: number): void {
    this.rotationId = rotationId;
    this.flightService.getFlights(this.fileId, this.rotationId)
      .subscribe((flightsPage: Page<Flight>) => {
        this.flights = flightsPage.content
          .map((flight: Flight) => { return { ...flight, description: `${flight.origin} - ${flight.destination}` } });
        this.additionalServicesForm.get('flights').reset();
        if (this.flights?.length === 1) {
          this.additionalServicesForm.get('flights').setValue([this.flights[0].id]);
        }
      });
  }

  private obtainProviders(): void {
    this.providerService.getProviders()
      .subscribe((providerPage: Page<Provider>) => this.providers = providerPage.content);
  }

  private loadServices(): void {
    this.services$ = concat(
      of([]), // default items
      this.servicesInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.servicesLoading = true)),
        switchMap((term: string) =>
          this.servicesService.getServices({ filter_name: term }).pipe(
            map((page: Page<Services>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.servicesLoading = false))
          )
        )
      )
    );
  }

  public addAdditionalService() {
    this.isLoading = true;
    this.additionalServicesForm.markAsTouched();
    if (!this.additionalServicesForm.valid) {
      this.additionalServicesForm.markAllAsTouched();
      return;
    }
    const additionalService: AdditionalService = {
      description: this.additionalServicesForm.get('description').value,
      providerId: this.additionalServicesForm.get('provider').value,
      purchasePrice: this.additionalServicesForm.get('purchasePrice').value,
      salePrice: this.additionalServicesForm.get('salePrice').value,
      quantity: this.additionalServicesForm.get('quantity').value,
      serviceId: this.additionalServicesForm.get('services').value.id,
      flightIdList: this.additionalServicesForm.get('flights').value,
      comment: this.additionalServicesForm.get('observation').value
    };
    this.additionalServicesService.createAdditionalService(this.fileId, this.rotationId, additionalService)
      .subscribe(() => {
        this.router.navigate([this.getReturnRoute()]);
        this.isLoading = false;
      }, () => this.isLoading = false, () => this.isLoading = false);
  }

  public getReturnRoute() {
    return `/files/${this.fileId}`;
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.additionalServicesForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.additionalServicesForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public isControlDisabled(controlName: string): boolean {
    const control = this.additionalServicesForm.get(controlName);
    return control?.disabled;
  }
}
