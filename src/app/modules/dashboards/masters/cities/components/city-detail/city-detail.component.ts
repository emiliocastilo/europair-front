import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { City } from '../../models/city';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Country } from '../../../countries/models/country';
import { CountriesService } from '../../../countries/services/countries.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss']
})
export class CityDetailComponent implements OnInit {
  public readonly selectItemValue: string = 'id';
  public readonly selectItemDescription: string ='name';
  public readonly selectId: string = 'country';
  public readonly selectLabel: string = 'País';
  public readonly selectPlaceholder: string = 'Selecciona un país';

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
      this.countryControl.setValue(this._cityDetail.country.id);
    } else {
      this.cityNameControl.reset();
      this.cityCodeControl.reset();
      this.countryControl.reset();
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
  public countryControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );
  public countries: Array<Country>;

  private _cityDetail: City;
  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe((data: Page<Country>) => this.countries = data.content);
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
      this.countryControl.invalid &&
      (this.countryControl.dirty || this.countryControl.touched)
    );
  }

  public anyFieldInvalid(): boolean {
    return this.cityNameControl.invalid || this.cityCodeControl.invalid || this.countryControl.invalid;
  }

  public onCity(): void {
    this.City.next({
      id: this._cityDetail.id,
      name: this.cityNameControl.value,
      code: this.cityCodeControl.value,
      country: {
        id: this.countryControl.value
      }
    });
  }
}
