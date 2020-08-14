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
import { Airport } from '../../models/airport';
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
    { type: BarButtonType.NEW, text: 'Crear aeropuerto' },
  ];
  private readonly editAirportBarButtons: BarButton[] = [
    { type: BarButtonType.EDIT, text: 'Guardar aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Eliminar aeropuerto' },
  ];
  public barButtons: BarButton[];
  public hasAirportSpecialConditions: boolean;
  public airportData: Airport;

  public generalDataForm = this.fb.group({
    id: [null],
    iataCode: ['', Validators.required],
    icaoCode: ['', Validators.required],
    name: ['', Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
    timeZone: [''],
    altitude: [''],
    latitude: [''],
    longitude: [''],
    customs: [null],
    specialConditions: [null],
    flightRules: [null],
  });

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private airportsService: AirportsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
      };
      console.log('SAVING AIRPORT', this.airportData);
      this.airportsService
        .addAirport(this.airportData)
        .subscribe((aiport) => this.router.navigate(['airports', aiport.id]));
    } else {
      this.generalDataForm.markAllAsTouched();
    }
  };
  // TODO REFACTOR DRY
  private editAirport = () => {
    if (this.generalDataForm.valid) {
      this.airportData = {
        ...this.generalDataForm.value,
        iataCode: this.generalDataForm.value.iataCode.toUpperCase(),
        icaoCode: this.generalDataForm.value.icaoCode.toUpperCase(),
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

  public onConfirmDeleteAirport() {
    this.airportsService
      .deleteAirport(this.airportData)
      .subscribe(() => this.router.navigate(['airports']));
  }

  private barButtonActions = {
    new: this.newAirport,
    edit: this.editAirport,
    delete: this.deleteAirport,
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
