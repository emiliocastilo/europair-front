import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Country } from '../../models/country';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent {
  @Input()
  public countriesColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public title: string;
  @Input()
  public set countryDetail(country: Country) {
    this._countryDetail = { ...country };
    if (country.code) {
      this.countryNameControl.setValue(this._countryDetail.name);
      this.countryCodeControl.setValue(this._countryDetail.code);
    } else {
      this.countryNameControl.reset();
      this.countryCodeControl.reset();
    }
  }

  @Output()
  public saveCountry: EventEmitter<Country> = new EventEmitter();

  public countryNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countryCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );

  private _countryDetail: Country;

  constructor(private readonly fb: FormBuilder) { }

  public hasCountryNameControlErrors(): boolean {
    return (
      this.countryNameControl.invalid &&
      (this.countryNameControl.dirty || this.countryNameControl.touched)
    );
  }

  public hasCountryCodeControlErrors(): boolean {
    return (
      this.countryCodeControl.invalid &&
      (this.countryCodeControl.dirty || this.countryCodeControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return !this.countryNameControl.valid || !this.countryCodeControl.valid;
  }

  public onSaveCountry(): void {
    this.saveCountry.next({
      id: this._countryDetail.id,
      name: this.countryNameControl.value,
      code: this.countryCodeControl.value
    });
  }
}
