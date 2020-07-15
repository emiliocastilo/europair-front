import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { City, SaveCity, Country } from '../../models/city';
import { CitiesService } from '../../services/cities.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss']
})
export class CityDetailComponent implements OnInit {
  @Input()
  public citiesColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public title: string;
  @Input()
  public set cityDetail(city: City) {
    this._cityDetail = { ...city };
    if (city.code) {
      this.cityNameControl.setValue(this._cityDetail.name);
      this.cityCodeControl.setValue(this._cityDetail.code);
    } else {
      this.cityNameControl.reset();
      this.cityCodeControl.reset();
      this.countryCodeControl.reset();
    }
  }

  @Output()
  public saveCity: EventEmitter<SaveCity> = new EventEmitter();

  public cityNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public cityCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countryCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countrySelected: Country;

  private countries: Array<Country> = [];
  private _cityDetail: City;
  constructor(
    private readonly fb: FormBuilder,
    private readonly citiesService: CitiesService/*,
    private readonly countriesService: CountriesService*/
  ) { }

  ngOnInit(): void {
    this.citiesService.getCountries().subscribe((countries: Array<Country>) => {
      this.countries = countries;
      this.countrySelected = countries.find((country: Country) => country.code === this._cityDetail.country.code);
      if (this.countrySelected) {
        this.countryCodeControl.setValue(this._cityDetail.country.code);
      }
    });
  }

  public hasCityNameControlErrors(): boolean {
    return (
      this.cityNameControl.invalid &&
      (this.cityNameControl.dirty || this.cityNameControl.touched)
    );
  }

  public hasCityCodeControlErrors(): boolean {
    return (
      this.cityCodeControl.invalid &&
      (this.cityCodeControl.dirty || this.cityCodeControl.touched)
    );
  }

  public hasCountryControlErrors(): boolean {
    return (
      this.countryCodeControl.invalid &&
      (this.countryCodeControl.dirty || this.countryCodeControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return !this.cityNameControl.valid || !this.cityCodeControl.valid || !this.countryCodeControl.valid;
  }

  public onSaveCity(): void {
    this.saveCity.next({
      name: this.cityNameControl.value,
      code: this.cityCodeControl.value,
      oldCode: this._cityDetail.code,
      country: {
        code: this.countryCodeControl.value
      }
    });
  }
}
