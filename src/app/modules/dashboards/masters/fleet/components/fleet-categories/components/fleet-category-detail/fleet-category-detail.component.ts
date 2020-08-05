import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { CountriesService } from 'src/app/modules/dashboards/masters/countries/services/countries.service';
import { FleetCategory, FleetSubcategory } from '../../../../models/fleet';

@Component({
  selector: 'app-fleet-category-detail',
  templateUrl: './fleet-category-detail.component.html',
  styleUrls: ['./fleet-category-detail.component.scss']
})
export class FleetCategoryDetailComponent implements OnInit {
  @Input()
  public categoryColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public title: string;
  @Input()
  public set categoryDetail(category: FleetCategory) {
    this._categoryDetail = { ...category };
    if (category.code) {
      this.categoryNameControl.setValue(this._categoryDetail.name);
      this.categoryCodeControl.setValue(this._categoryDetail.code);
    } else {
      this.categoryNameControl.reset();
      this.categoryCodeControl.reset();
    }
  }

  @Output()
  public saveCategory: EventEmitter<FleetCategory> = new EventEmitter();

  public categoryNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public categoryCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countries: Array<FleetSubcategory>;

  private _categoryDetail: FleetCategory;
  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void { }

  public hasCategoryNameControlErrors(): boolean {
    return (
      this.categoryNameControl.invalid &&
      (this.categoryNameControl.dirty || this.categoryNameControl.touched)
    );
  }

  public hasCategoryCodeControlErrors(): boolean {
    return (
      this.categoryCodeControl.invalid &&
      (this.categoryCodeControl.dirty || this.categoryCodeControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return this.categoryNameControl.invalid || this.categoryCodeControl.invalid;
  }

  public onSaveCategory(): void {
    this.saveCategory.next({
      ...this._categoryDetail,
      name: this.categoryNameControl.value,
      code: this.categoryCodeControl.value,
    });
  }
}

