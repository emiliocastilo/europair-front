import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MeasureType } from 'src/app/core/models/base/measure';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  FleetCategory,
  FleetSubcategory,
  FleetType,
  EMPTY_FLEET_TYPE,
} from '../../../../models/fleet';
import { FleetCategoriesService } from '../../../fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../fleet-categories/services/fleet-subcategories.service';
import { FleetTypesService } from '../../../fleet-types/services/fleet-types.service';

@Component({
  selector: 'app-fleet-type-detail',
  templateUrl: './fleet-type-detail.component.html',
  styleUrls: ['./fleet-type-detail.component.scss'],
})
export class FleetTypeDetailComponent implements OnInit, OnDestroy {
  public pageTitle = 'Nuevo Tipo';

  private typeDetail: FleetType = EMPTY_FLEET_TYPE;
  private unsubscribe$: Subject<any> = new Subject();

  public isFleetTypeDetail: boolean;

  public categories: Array<FleetCategory> = [];
  public subcategories: Array<FleetSubcategory> = [];
  public measuresType: Array<MeasureType> = [];

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
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    flightRange: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    flightRangeUnit: new FormControl(''),
    cabinWidth: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    cabinWidthUnit: new FormControl(''),
    cabinHeight: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    cabinHeightUnit: new FormControl(''),
    cabinLength: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    cabinLengthUnit: new FormControl(''),
    maxCargo: new FormControl(''),
    averageSpeed: new FormControl([]),
    observations: new FormControl([]),
  });

  constructor(
    private readonly categoriesService: FleetCategoriesService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly typesService: FleetTypesService,
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

    this.initializeFleetTypeData(this.route.snapshot.data);
    this.typeForm
      .get('cabinWidthUnit')
      .valueChanges.subscribe((value: MeasureType) => {
        this.patchCabinUnits(value);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    console.log({
      ...EMPTY_FLEET_TYPE,
      ...this.typeForm.value,
    });

    this.typesService
      .saveFleetType({
        ...EMPTY_FLEET_TYPE,
        ...this.typeForm.value,
      })
      .subscribe(() => {
        this.router.navigate(['fleet/types']);
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
}
