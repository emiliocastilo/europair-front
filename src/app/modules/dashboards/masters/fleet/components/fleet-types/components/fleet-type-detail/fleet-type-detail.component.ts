import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FleetType } from '../../../../models/fleet';

@Component({
  selector: 'app-fleet-type-detail',
  templateUrl: './fleet-type-detail.component.html',
  styleUrls: ['./fleet-type-detail.component.scss']
})
export class FleetTypeDetailComponent implements OnInit {
  @Input()
  public typeColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public title: string;
  @Input()
  public set typeDetail(type: FleetType) {
    this._typeDetail = { ...type };
    if (type.code) {
      this.form.get('code').setValue(this._typeDetail.code);
      this.form.get('description').setValue(this._typeDetail.description);
      this.form.get('category').setValue(this._typeDetail.category);
      this.form.get('subcategory').setValue(this._typeDetail.subcategory);
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
  public form: FormGroup = this.fb.group({
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    rangeMeasureValue: new FormControl('', Validators.required),
    rangeMeasureType: new FormControl('', Validators.required)
  });

  private _typeDetail: FleetType;
  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void { }

  public isInvalid(field: string): boolean {
    return (
      this.form.get(field).invalid &&
      (this.form.get(field).dirty || this.form.get(field).touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return this.form.invalid;
  }

  public onSaveType(): void {
    this.saveType.next({
      id: this._typeDetail.id,
      code: this.form.get('code').value,
      description: this.form.get('description').value,
      category: { id: this.form.get('category').value.id },
      subcategory: { id: this.form.get('subcategory').value.id },
      flightRange: {
        value: this.form.get('rangeMeasureValue').value,
        type: this.form.get('rangeMeasureType').value
      },
      producer: '',
      cabinInformation: undefined
    });
  }
}

