import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MeasureType } from 'src/app/core/models/base/measure';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  FleetCategory,
  FleetSubcategory,
  FleetType,
} from '../../../../models/fleet';
import { FleetCategoriesService } from '../../../fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../fleet-categories/services/fleet-subcategories.service';

@Component({
  selector: 'app-fleet-type-detail',
  templateUrl: './fleet-type-detail.component.html',
  styleUrls: ['./fleet-type-detail.component.scss'],
})
export class FleetTypeDetailComponent implements OnInit {
  public pageTitle = 'Nuevo Tipo';

  @Input()
  public set typeDetail(type: FleetType) {
    this._typeDetail = { ...type };
    if (type.code) {
      this.typeForm.get('code').setValue(this._typeDetail.code);
      this.typeForm.get('description').setValue(this._typeDetail.description);
      this.typeForm.get('category').setValue(this._typeDetail.category.id);
      this.typeForm
        .get('subcategory')
        .setValue(this._typeDetail.subcategory.id);
      this.typeForm
        .get('rangeMeasureValue')
        .setValue(this._typeDetail.flightRange.value);
      this.typeForm
        .get('rangeMeasureType')
        .setValue(this._typeDetail.flightRange.type);
    } else {
      this.typeForm.get('code').reset();
      this.typeForm.get('description').reset();
      this.typeForm.get('category').reset();
      this.typeForm.get('subcategory').reset();
      this.typeForm.get('rangeMeasureValue').reset();
      this.typeForm.get('rangeMeasureType').reset();
    }
  }

  @Output()
  public saveType: EventEmitter<FleetType> = new EventEmitter();

  public categories: Array<FleetCategory> = [];
  public subcategories: Array<FleetSubcategory> = [];
  public measuresType: Array<MeasureType> = [];

  private typeForm: FormGroup = this.fb.group({
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    rangeMeasureValue: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    rangeMeasureType: new FormControl('', Validators.required),
  });

  private _typeDetail: FleetType;
  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: FleetCategoriesService,
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
    this.saveType.next({
      ...this._typeDetail,
      code: this.typeForm.get('code').value,
      description: this.typeForm.get('description').value,
      category: {
        ...this._typeDetail.category,
        id: this.typeForm.get('category').value,
      },
      subcategory: {
        ...this._typeDetail.subcategory,
        id: this.typeForm.get('subcategory').value,
      },
      flightRange: {
        value: this.typeForm.get('rangeMeasureValue').value,
        type: this.typeForm.get('rangeMeasureType').value,
      },
      producer: '',
      cabinInformation: undefined,
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
