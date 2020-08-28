import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { MeasureType } from 'src/app/core/models/base/measure';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import {
  AverageSpeed,
  EMPTY_FLEET_TYPE,
  EMPTY_FLEET_TYPE_SPEED,
  FleetCategory,
  FleetSubcategory,
  FleetType,
  FleetTypeObservation,
} from '../../../../models/fleet';
import { FleetCategoriesService } from '../../../fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../fleet-categories/services/fleet-subcategories.service';
import { FleetTypesTableAdapterService } from '../../../fleet-types/services/fleet-types-table-adapter.service';
import { FleetTypesService } from '../../../fleet-types/services/fleet-types.service';
import { ObservationDetailComponent } from './components/observation-detail/observation-detail.component';
import { SpeedAverageDetailComponent } from './components/speed-average-detail/speed-average-detail.component';

@Component({
  selector: 'app-fleet-type-detail',
  templateUrl: './fleet-type-detail.component.html',
  styleUrls: ['./fleet-type-detail.component.scss'],
  providers: [FleetTypesTableAdapterService],
})
export class FleetTypeDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ObservationDetailComponent, { static: true, read: ElementRef })
  public observationDetailModal: ElementRef;

  @ViewChild(SpeedAverageDetailComponent, { static: true, read: ElementRef })
  public speedAverageDetailModal: ElementRef;

  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public deleteModalText: string;
  public deleteModalAction: any;

  public modalDetailTitle: string;
  private readonly EDIT_SPEED_TITLE = 'Editar velocidad';
  private readonly CREATE_SPEED_TITLE = 'Crear velocidad';
  private readonly DELETE_SPEED_TITLE =
    '¿Está seguro que desea eliminar la velocidad?';
  private readonly EDIT_OBSERVATION_TITLE = 'Editar observación';
  private readonly CREATE_OBSERVATION_TITLE = 'Crear observación';
  private readonly DELETE_OBSERVATION_TITLE =
    '¿Está seguro que desea eliminar la observación?';

  public pageTitle = 'Nuevo Tipo';

  private typeDetail: FleetType = EMPTY_FLEET_TYPE;
  private unsubscribe$: Subject<any> = new Subject();

  public isFleetTypeDetail: boolean;

  public categories: Array<FleetCategory> = [];
  public subcategories: Array<FleetSubcategory> = [];
  public measuresType: Array<MeasureType> = [];
  public observations: FleetTypeObservation[] = [];
  public averageSpeeds: AverageSpeed[] = [];

  public typeObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public typeObservationsColumnsData: RowDataModel[] = [];
  public typeObservationsColumnsPagination: PaginationModel;

  public typeSpeedAverageColumnsHeader: ColumnHeaderModel[] = [];
  public typeSpeedAverageColumnsData: RowDataModel[] = [];
  public typeSpeedAverageColumnsPagination: PaginationModel;

  public typeSpeedSelected: AverageSpeed;
  public typeSpeedSelectedCount = 0;
  public typeDetailsBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva' },
    { type: BarButtonType.EDIT, text: 'Editar' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];
  private typeSpeedTableActions = {
    new: this.newTypeSpeed,
    edit: this.editTypeSpeed,
    delete_selected: this.deleteTypeSpeed,
  };

  public typeObsSelected: FleetTypeObservation;
  public typeObsSelectedCount = 0;
  private typeObsTableActions = {
    new: this.newTypeObservation,
    edit: this.editTypeObservation,
    delete_selected: this.deleteTypeObservation,
  };

  public typeForm: FormGroup = this.fb.group({
    iataCode: new FormControl('', [
      Validators.required,
      Validators.maxLength(3),
    ]),
    icaoCode: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
    ]),
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    manufacturer: new FormControl('', Validators.required),
    category: new FormControl(null, Validators.required),
    subcategory: new FormControl(null, Validators.required),
    flightRange: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
    flightRangeUnit: new FormControl(null),
    cabinWidth: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
    cabinWidthUnit: new FormControl(null),
    cabinHeight: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
    cabinHeightUnit: new FormControl(null),
    cabinLength: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
    cabinLengthUnit: new FormControl(null),
    maxCargo: new FormControl(null),
    averageSpeed: new FormControl([]),
    observations: new FormControl([]),
  });

  public averageSpeedForm = this.fb.group({
    fromDistance: ['', Validators.required],
    toDistance: ['', Validators.required],
    distanceUnit: [null, Validators.required],
    averageSpeed: ['', Validators.required],
    averageSpeedUnit: [null, Validators.required],
  });

  public observationForm = this.fb.group({
    observation: ['', Validators.required],
  });

  constructor(
    private readonly categoriesService: FleetCategoriesService,
    private readonly fb: FormBuilder,
    private readonly modalService: ModalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly typesService: FleetTypesService,
    private readonly typesServiceTableAdapter: FleetTypesTableAdapterService,
    private readonly subcategoriesService: FleetSubcategoriesService
  ) {}

  ngOnInit(): void {
    this.categoriesService
      .getFleetCategories()
      .subscribe(
        (data: Page<FleetCategory>) => (this.categories = data.content)
      );
    // TODO: Obtener de servicio
    this.measuresType = [
      MeasureType.FOOT,
      MeasureType.INCH,
      MeasureType.KILOMETER,
      MeasureType.METER,
      MeasureType.NAUTIC_MILE,
    ];

    this.typeObservationsColumnsHeader = this.typesServiceTableAdapter.getFleetTypeObservationColumnsHeader();
    this.typeSpeedAverageColumnsHeader = this.typesServiceTableAdapter.getFleetTypeAverageSpeedColumnsHeader();

    this.initializeFleetTypeData(this.route.snapshot.data);
    this.typeForm
      .get('cabinWidthUnit')
      .valueChanges.subscribe((value: MeasureType) => {
        this.patchCabinUnits(value);
      });
  }

  private retrieveObservations(fleetTypeId: number) {
    this.typesService
      .getFleetTypeObservations(fleetTypeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((observationsPage: Page<FleetTypeObservation>) => {
        this.observations = observationsPage.content;
        this.typeObservationsColumnsData = this.typesServiceTableAdapter.getFleetTypeObservationsTableData(
          observationsPage.content
        );
        this.typeObservationsColumnsPagination = this.initializeClientTablePagination(
          this.typeObservationsColumnsData
        );
      });
  }

  private retrieveSpeedAverages(fleetTypeId: number) {
    this.typesService
      .getFleetTypeSpeedAverages(fleetTypeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((speedAverages: Page<AverageSpeed>) => {
        this.averageSpeeds = speedAverages.content;
        this.typeSpeedAverageColumnsData = this.typesServiceTableAdapter.getFleetTypeSpeedAverageTableData(
          speedAverages.content
        );
        this.typeSpeedAverageColumnsPagination = this.initializeClientTablePagination(
          this.typeSpeedAverageColumnsData
        );
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private newTypeSpeed() {
    this.modalDetailTitle = this.CREATE_SPEED_TITLE;
    this.typeSpeedSelected = null;
    this.typeSpeedSelectedCount = 0;
    this.averageSpeedForm.reset();
    this.initializeModal(this.speedAverageDetailModal);
    this.modalService.openModal();
  }

  private editTypeSpeed(selectedItem: number): void {
    this.modalDetailTitle = this.EDIT_SPEED_TITLE;
    this.averageSpeedForm.patchValue({
      ...EMPTY_FLEET_TYPE_SPEED,
      ...this.typeSpeedSelected,
    });
    this.initializeModal(this.speedAverageDetailModal);
    this.modalService.openModal();
  }

  private deleteTypeSpeed(selectedItem: number) {
    this.deleteModalText = this.DELETE_SPEED_TITLE;
    this.deleteModalAction = this.onConfirmDeleteSpeed;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  private newTypeObservation() {
    this.modalDetailTitle = this.CREATE_OBSERVATION_TITLE;
    this.typeObsSelected = null;
    this.typeObsSelectedCount = 0;
    this.observationForm.reset();
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  }

  private editTypeObservation(selectedItem: number): void {
    this.modalDetailTitle = this.EDIT_OBSERVATION_TITLE;
    this.observationForm.patchValue({
      observation: undefined,
      ...this.typeObsSelected,
    });
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  }

  private deleteTypeObservation(selectedItem: number) {
    this.deleteModalText = this.DELETE_OBSERVATION_TITLE;
    this.deleteModalAction = this.onConfirmDeleteObservation;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onSpeedBarButtonClicked(barButtonType: BarButtonType) {
    this.typeSpeedTableActions[barButtonType].bind(this)();
  }

  public onObsBarButtonClicked(barButtonType: BarButtonType) {
    this.typeObsTableActions[barButtonType].bind(this)();
  }

  public onObservationSelected(baseIndex: number): void {
    this.typeObsSelected = this.observations[baseIndex];
    this.typeObsSelectedCount = 1;
  }

  public onSpeedAverageSelected(baseIndex: number): void {
    this.typeSpeedSelected = this.averageSpeeds[baseIndex];
    this.typeSpeedSelectedCount = 1;
  }

  public onConfirmDeleteSpeed() {
    this.typesService
      .removeFleetTypeSpeedAverage(
        this.typeDetail.id,
        this.typeSpeedSelected.id
      )
      .subscribe(() => {
        this.typeSpeedSelected = null;
        this.typeSpeedSelectedCount = 0;
        this.retrieveSpeedAverages(this.typeDetail.id);
      });
  }

  public onConfirmDeleteObservation() {
    this.typesService
      .removeFleetTypeObservation(this.typeDetail.id, this.typeObsSelected.id)
      .subscribe(() => {
        this.typeObsSelected = null;
        this.typeObsSelectedCount = 0;
        this.retrieveObservations(this.typeDetail.id);
      });
  }

  private patchCabinUnits(value: MeasureType) {
    this.typeForm.get('cabinHeightUnit').setValue(value);
    this.typeForm.get('cabinLengthUnit').setValue(value);
  }

  private initializeFleetTypeData({ title, isFleetTypeDetail }: any) {
    this.pageTitle = title;
    if (isFleetTypeDetail) {
      this.isFleetTypeDetail = true;
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ typeId }) => {
          this.retrieveTypeData(typeId);
          this.retrieveObservations(typeId);
          this.retrieveSpeedAverages(typeId);
        });
    }
  }

  private retrieveTypeData(typeId: number) {
    this.typesService
      .getFleetTypeById(typeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fleetType: FleetType) => {
        this.typeDetail = { ...EMPTY_FLEET_TYPE, ...fleetType };
        this.updateTypeForm(this.typeDetail);
      });
  }

  private updateTypeForm(selectedType: FleetType) {
    this.typeForm.setValue({
      iataCode: selectedType.iataCode,
      icaoCode: selectedType.icaoCode,
      code: selectedType.code,
      description: selectedType.description,
      manufacturer: selectedType.manufacturer,
      category: selectedType.category,
      subcategory: selectedType.subcategory,
      flightRange: selectedType.flightRange,
      flightRangeUnit: selectedType.flightRangeUnit,
      cabinWidth: selectedType.cabinWidth,
      cabinWidthUnit: selectedType.cabinWidthUnit,
      cabinHeight: selectedType.cabinHeight,
      cabinHeightUnit: selectedType.cabinHeightUnit,
      cabinLength: selectedType.cabinLength,
      cabinLengthUnit: selectedType.cabinLengthUnit,
      maxCargo: selectedType.maxCargo,
      averageSpeed: selectedType.averageSpeed,
      observations: selectedType.observations,
    });
  }

  public obtainSubcategories(category: FleetCategory): void {
    this.subcategoriesService
      .getFleetSubcategoriesFromCategory(category)
      .subscribe(
        (data: Page<FleetSubcategory>) => (this.subcategories = data.content)
      );
  }

  public isInvalid(field: string): boolean {
    return (
      this.typeForm.get(field).invalid &&
      (this.typeForm.get(field).dirty || this.typeForm.get(field).touched)
    );
  }

  public getControl(fieldName: string): AbstractControl {
    return this.typeForm.get(fieldName);
  }

  public anyFieldInvalid(): boolean {
    return this.typeForm.invalid;
  }

  public onSaveType(): void {
    this.typesService
      .saveFleetType({
        ...this.typeDetail,
        ...this.typeForm.value,
      })
      .subscribe(() => {
        this.router.navigate(['fleet/types']);
      });
  }

  public onSaveSpeedAverage(speedAverage: AverageSpeed): void {
    this.typesService
      .saveFleetTypeSpeedAverage(this.typeDetail.id, {
        ...this.typeSpeedSelected,
        ...speedAverage,
      })
      .subscribe((speed) => {
        this.typeSpeedSelected = speed;
        this.retrieveSpeedAverages(this.typeDetail.id);
      });
  }

  public onSaveObservation(observation: FleetTypeObservation): void {
    this.typesService
      .saveFleetTypeObservation(this.typeDetail.id, {
        ...this.typeObsSelected,
        ...observation,
      })
      .subscribe((obs) => {
        this.typeObsSelected = obs;
        this.retrieveObservations(this.typeDetail.id);
      });
  }

  public getSubcategoriePlaceholder(): string {
    return this.getControl('category').value
      ? 'Selecciona una subcategoría'
      : 'Selecciona primero una categoría';
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.typeForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.typeForm.get(controlName);
    return control && control.hasError(errorName);
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.typesServiceTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
