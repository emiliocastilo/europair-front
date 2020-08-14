import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { FleetType, FleetCategory, FleetSubcategory } from '../../../../models/fleet';
import { FleetCategoriesService } from '../../../fleet-categories/services/fleet-categories.service';
import { FleetSubcategoriesService } from '../../../fleet-categories/services/fleet-subcategories.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { MeasureType } from 'src/app/core/models/base/measure';

@Component({
  selector: 'app-fleet-type-detail',
  templateUrl: './fleet-type-detail.component.html',
  styleUrls: ['./fleet-type-detail.component.scss']
})
export class FleetTypeDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public set typeDetail(type: FleetType) {
    this._typeDetail = { ...type };
    if (type.code) {
      this.form.get('code').setValue(this._typeDetail.code);
      this.form.get('description').setValue(this._typeDetail.description);
      this.form.get('category').setValue(this._typeDetail.category.id);
      this.form.get('subcategory').setValue(this._typeDetail.subcategory.id);
      this.form.get('rangeMeasureValue').setValue(this._typeDetail.flightRange.value);
      this.form.get('rangeMeasureType').setValue(this._typeDetail.flightRange.type);
    } else {
      this.form.get('code').reset();
      this.form.get('description').reset();
      this.form.get('category').reset();
      this.form.get('subcategory').reset();
      this.form.get('rangeMeasureValue').reset();
      this.form.get('rangeMeasureType').reset();
    }
  }

  @Output()
  public saveType: EventEmitter<FleetType> = new EventEmitter();

  public categories: Array<FleetCategory> = [];
  public subcategories: Array<FleetSubcategory> = [];
  public measuresType: Array<MeasureType> = [];

  private form: FormGroup = this.fb.group({
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    rangeMeasureValue: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    rangeMeasureType: new FormControl('', Validators.required)
  });

  private _typeDetail: FleetType;
  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: FleetCategoriesService,
    private readonly subcategoriesService: FleetSubcategoriesService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getFleetCategories().subscribe((data: Page<FleetCategory>) => this.categories = data.content);
    // TODO: Obtener de servicio
    this.measuresType = [
      MeasureType.FOOT,
      MeasureType.INCH,
      MeasureType.KILOMETER,
      MeasureType.METER,
      MeasureType.NAUTIC_MILE
    ];
  }

  public obtainSubcategories(category: FleetCategory): void {
    this.subcategoriesService.getFleetSubcategoriesFromCategory(category)
    .subscribe((data: Page<FleetSubcategory>) => this.subcategories = data.content);
  }

  public isInvalid(field: string): boolean {
    return (
      this.form.get(field).invalid &&
      (this.form.get(field).dirty || this.form.get(field).touched)
    );
  }

  public getControl(fieldName: string): AbstractControl {
    return this.form.get(fieldName);
  }

  public anyFieldInvalid(): boolean {
    return this.form.invalid;
  }

  public onSaveType(): void {
    this.saveType.next({
      ...this._typeDetail,
      code: this.form.get('code').value,
      description: this.form.get('description').value,
      category: { ...this._typeDetail.category, id: this.form.get('category').value },
      subcategory: { ...this._typeDetail.subcategory, id: this.form.get('subcategory').value },
      flightRange: {
        value: this.form.get('rangeMeasureValue').value,
        type: this.form.get('rangeMeasureType').value
      },
      producer: '',
      cabinInformation: undefined
    });
  }

  public getSubcategoriePlaceholder(): string {
    return this.getControl('category').value ? 'Selecciona una subcategoría' : 'Selecciona primero una categoría';
  }
}

