import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Country, CountryPageable } from '../../models/country';
import { CountriesService } from '../../services/countries.service';

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
    this.numbersControl.reset();
  }

  @Output()
  public saveCountry: EventEmitter<Country> = new EventEmitter();

  public showErrors: boolean = false;
  public countryNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countryCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );

  public numbersControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countries: Array<Country>;
  public number: Array<{id: number, att: string, name: string}> = [{id: 1, att: 'asdasd', name: 'uno'},{id: 2, att: 'asdasd', name: 'dos'},{id: 3, att: 'asdasd', name: 'tres'},{id: 4, att: 'asdasd', name: 'cuatro'}];

  private _countryDetail: Country;

  constructor(private readonly fb: FormBuilder, private readonly countriesService: CountriesService) {
    this.countriesService.getCountries().subscribe((countries: CountryPageable) => this.countries =  countries.content);
  }

  public select($event): void {
    console.log($event);
  }


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

  public hasError(): boolean {
    return (
      this.numbersControl.invalid &&
      (this.numbersControl.dirty || this.numbersControl.touched)
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
