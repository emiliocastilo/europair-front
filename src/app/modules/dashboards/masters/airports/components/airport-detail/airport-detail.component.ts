import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Data, Router, Params } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { AirportsService } from '../../services/airports.service';
import { Airport, CustomsType } from '../../models/airport';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';

@Component({
  selector: 'app-airport-detail',
  templateUrl: './airport-detail.component.html',
  styleUrls: ['./airport-detail.component.scss'],
})
export class AirportDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  private unsubscriber$: Subject<void> = new Subject();
  public routeData$: Observable<Data>;
  private readonly newAirportBarButtons: BarButton[] = [
    { type: BarButtonType.GO_BACK, text: 'Volver' },
    { type: BarButtonType.NEW, text: 'Crear aeropuerto' },
  ];
  private readonly editAirportBarButtons: BarButton[] = [
    { type: BarButtonType.GO_BACK, text: 'Volver' },
    { type: BarButtonType.EDIT, text: 'Guardar aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Eliminar aeropuerto' },
    { type: BarButtonType.VIEW, text: 'Ver flota' }
  ];
  public barButtons: BarButton[];
  public hasAirportSpecialConditions: boolean;
  public airportData: Airport;

  public generalDataForm = this.fb.group({
    id: [null],
    iataCode: [''],
    icaoCode: ['', Validators.required],
    name: ['', Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
    timeZone: [''],
    elevation: this.fb.group({
      value: [''],
      type: [null],
    }),
    latitude: [''],
    longitude: [''],
    simpleCustoms: [null],
    specialConditions: [null],
    flightRules: [null],
    balearics: [null],
    canary_islands: [null]
  });

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private airportsService: AirportsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeData$ = this.route.data.pipe(
      tap(this.initAirportData),
      tap(this.initButtonBar)
    );
  }

  private initAirportData = ({ isAirportDetail }): void => {
    if (isAirportDetail) {
      this.route.params
        .pipe(
          switchMap((params: Params) =>
            this.airportsService.getAirport(params.airportId)
          )
        )
        .subscribe((airport: Airport) => this.getAirportGeneralData(airport));
    }
  };

  private getAirportGeneralData(airport: Airport) {
    airport.simpleCustoms = airport.customs === CustomsType.YES;
    this.airportData = airport;
    this.generalDataForm.patchValue(airport);
  }

  private initButtonBar = ({ isAirportDetail }): void => {
    this.barButtons = isAirportDetail
      ? this.editAirportBarButtons
      : this.newAirportBarButtons;
  };

  // TODO REFACTOR DRY
  private newAirport = () => {
    if (this.generalDataForm.valid) {
      this.airportData = {
        ...this.generalDataForm.value,
        iataCode: this.generalDataForm.get('iataCode').value.toUpperCase(),
        icaoCode: this.generalDataForm.get('icaoCode').value.toUpperCase(),
        customs: this.generalDataForm.get('simpleCustoms').value ? CustomsType.YES : CustomsType.NO,
        simpleCustoms: undefined,
        timeZone: this.generalDataForm.get('timeZone').value ? this.generalDataForm.get('timeZone').value : null,
        latitude: (this.generalDataForm.get('latitude').value as string).replace(',', '.'),
        longitude: (this.generalDataForm.get('longitude').value as string).replace(',', '.')
      };
      console.log('SAVING AIRPORT', this.airportData);
      this.airportsService
        .addAirport(this.airportData)
        .subscribe((airport) => this.router.navigate(['airports', airport.id]));
    } else {
      this.generalDataForm.markAllAsTouched();
    }
  };
  // TODO REFACTOR DRY
  private goBack = () => {
    this.router.navigate(['/airports']);
  };
  // TODO REFACTOR DRY
  private editAirport = () => {
    if (this.generalDataForm.valid) {
      this.airportData = {
        ...this.generalDataForm.value,
        iataCode: this.generalDataForm.value.iataCode.toUpperCase(),
        icaoCode: this.generalDataForm.value.icaoCode.toUpperCase(),
        customs: this.generalDataForm.value.simpleCustoms ? CustomsType.YES : CustomsType.NO,
        simpleCustoms: undefined
      };
      console.log('EDITING AIRPORT', this.airportData);
      this.airportsService
        .editAirport(this.airportData)
        .subscribe((airport: Airport) => {
          // this.getAirportGeneralData(airport)
        });
    } else {
      this.generalDataForm.markAllAsTouched();
    }
  };

  private deleteAirport = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private viewFleet = () => {
    const fleetId: number = 1;
    this.router.navigate(['fleet/aircraft'], { queryParams: { airportId: this.airportData.id} });
  };

  public onConfirmDeleteAirport() {
    this.airportsService
      .deleteAirport(this.airportData)
      .subscribe(() => this.router.navigate(['airports']));
  }

  private barButtonActions = {
    goBack: this.goBack,
    new: this.newAirport,
    edit: this.editAirport,
    delete: this.deleteAirport,
    view: this.viewFleet
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    console.log('onBarButtonClicked', barButtonType);
    this.barButtonActions[barButtonType]();
  }

  public onGeneralDataChanged(airportGeneralData: Airport) {
    console.log('onGeneralDataChanged', airportGeneralData);
    this.airportData = airportGeneralData;
  }

  public onSpecialConditionsChanged(hasAirportSpecialConditions: boolean) {
    this.hasAirportSpecialConditions = hasAirportSpecialConditions;
  }

  public getReturnRoute(): string {
    return '/airports';
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
