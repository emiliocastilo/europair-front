import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { FormGroup } from '@angular/forms';
import { Region, EMPTY_REGION } from '../../models/region';
import { Country } from 'src/app/modules/countries/models/country';
import { Airport } from '../../models/airport';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls: ['./region-detail.component.scss'],
})
export class RegionDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public regionCountryColumnsHeader: ColumnHeaderModel[] = [];
  @Input()
  public regionCountryColumnsData: RowDataModel[] = [];
  @Input()
  public regionAirportColumnsHeader: ColumnHeaderModel[] = [];
  @Input()
  public regionAirportColumnsData: RowDataModel[] = [];
  @Input()
  public regionForm: FormGroup;
  @Input()
  public set regionDetail(regionDetail: Region) {
    this._regionDetail = { ...regionDetail };
  }
  @Input()
  public countries: Country[];
  @Input()
  public airports: Airport[];
  @Output()
  public saveRegion: EventEmitter<Region> = new EventEmitter();

  public _regionDetail: Region = { ...EMPTY_REGION };

  constructor() {}

  ngOnInit(): void {}

  public onSaveRegion() {
    console.log({
      ...this._regionDetail,
      ...this.regionForm.value,
    });
    this.saveRegion.next({
      ...this._regionDetail,
      ...this.regionForm.value,
    });
  }

  public regionCountryAssignedChanged(event: {
    id: string;
    selectedItem: number;
  }) {
    const countryId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasRegionCountryAssigned(this._regionDetail, countryId)) {
      this._regionDetail.countries = this._regionDetail.countries.filter(
        (country: Country) => country.id !== countryId
      );
    } else {
      const countryToAdd = this.countries[event.selectedItem];
      this._regionDetail.countries = [
        ...this._regionDetail.countries,
        countryToAdd,
      ];
    }
  }

  public regionAirportAssignedChanged(event: {
    id: string;
    selectedItem: number;
  }) {
    const airportId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasRegionAirportAssigned(this._regionDetail, airportId)) {
      this._regionDetail.airports = this._regionDetail.airports.filter(
        (airport: Airport) => airport.id !== airportId
      );
    } else {
      const airportToAdd = this.airports[event.selectedItem];
      this._regionDetail.airports = [
        ...this._regionDetail.airports,
        airportToAdd,
      ];
    }
  }

  private hasRegionCountryAssigned(region: Region, countryId: number): boolean {
    return region.countries.some(
      (country: Country) => country.id === countryId
    );
  }

  private hasRegionAirportAssigned(region: Region, airportId: number): boolean {
    return region.airports.some((airport: Airport) => airport.id === airportId);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.regionForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.regionForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
