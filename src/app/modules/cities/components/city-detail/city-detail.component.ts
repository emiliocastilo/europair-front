import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { City, Country, Pageable } from '../../models/city';
import { CountriesService } from 'src/app/modules/countries/services/countries.service';

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
      this.countryIdControl.reset();
    }
  }

  @Output()
  public City: EventEmitter<City> = new EventEmitter();

  public cityNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public cityCodeControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countryIdControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countrySelected: Country;
  public countries: Array<Country>;

  private _cityDetail: City;
  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe((data: Pageable<Country>) => {
      this.countries = data.content;
      this.countrySelected = this.countries.find((country: Country) => country.id === this._cityDetail.country.id);
      if (this.countrySelected) {
        this.countryIdControl.setValue(this._cityDetail.country.id);
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
      this.countryIdControl.invalid &&
      (this.countryIdControl.dirty || this.countryIdControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return this.cityNameControl.invalid || this.cityCodeControl.invalid || this.countryIdControl.invalid;
  }

  public onCity(): void {
    this.City.next({
      id: this._cityDetail.id,
      name: this.cityNameControl.value,
      code: this.cityCodeControl.value,
      country: {
        id: this.countryIdControl.value
      }
    });
  }
}
