import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { FleetSubcategory } from '../../../../models/fleet';

@Component({
  selector: 'app-fleet-subcategory-detail',
  templateUrl: './fleet-subcategory-detail.component.html',
  styleUrls: ['./fleet-subcategory-detail.component.scss']
})
export class FleetSubcategoryDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public set subcategoryDetail(subcategory: FleetSubcategory) {
    this._subcategoryDetail = { ...subcategory };
    if (subcategory.code) {
      this.subcategoryOrderControl.setValue(this._subcategoryDetail.order);
      this.subcategoryNameControl.setValue(this._subcategoryDetail.name);
      this.subcategoryCodeControl.setValue(this._subcategoryDetail.code);
    } else {
      this.subcategoryNameControl.reset();
      this.subcategoryCodeControl.reset();
      this.subcategoryOrderControl.reset();
    }
  }

  @Output()
  public saveSubcategory: EventEmitter<FleetSubcategory> = new EventEmitter();

  public subcategoryOrderControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4)]
  );
  public subcategoryNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public subcategoryCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );

  private _subcategoryDetail: FleetSubcategory;
  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void { }

  public hasSubcategoryOrderControlErrors(): boolean {
    return (
      this.subcategoryOrderControl.invalid &&
      (this.subcategoryOrderControl.dirty || this.subcategoryOrderControl.touched)
    );
  }

  public hasSubcategoryNameControlErrors(): boolean {
    return (
      this.subcategoryNameControl.invalid &&
      (this.subcategoryNameControl.dirty || this.subcategoryNameControl.touched)
    );
  }

  public hasSubcategoryCodeControlErrors(): boolean {
    return (
      this.subcategoryCodeControl.invalid &&
      (this.subcategoryCodeControl.dirty || this.subcategoryCodeControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return this.subcategoryNameControl.invalid || this.subcategoryCodeControl.invalid || this.subcategoryOrderControl.invalid;
  }

  public onSaveSubcategory(): void {
    this.saveSubcategory.next({
      id: this._subcategoryDetail.id,
      name: this.subcategoryNameControl.value,
      code: this.subcategoryCodeControl.value,
      order: this.subcategoryOrderControl.value
    });
  }
}

