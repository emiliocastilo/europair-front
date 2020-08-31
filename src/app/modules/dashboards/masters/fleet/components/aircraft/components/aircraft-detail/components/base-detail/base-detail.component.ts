import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AircraftBase } from '../../../../models/Aircraft.model';
import { AirportsService } from 'src/app/modules/dashboards/masters/airports/services/airports.service';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { Page } from 'src/app/core/models/table/pagination/page';

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html',
  styleUrls: ['./base-detail.component.scss'],
})
export class BaseDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public baseForm: FormGroup;
  @Input()
  public enabledAircraftBase: boolean;
  @Input()
  public aircraftBase: AircraftBase;
  @Input()
  public modeEdit: boolean = false;

  @Output()
  public saveBase = new EventEmitter<AircraftBase>();

  public airports: Airport[];

  constructor(private airportService: AirportsService) {}

  ngOnInit(): void {
    this.airportService.getAirports().subscribe((airports: Page<Airport>) => this.airports = airports.content);
  }

  public onSaveBase() {
    const airport = this.airports.find((airport: Airport) => airport.id === this.baseForm.get('airport').value);
    const mainBase = this.baseForm.get('mainBase').value;
    this.saveBase.next({
      id: this.modeEdit ? this.aircraftBase.id : null,
      airport,
      mainBase
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public onChangeMainBase(selected: {id: string, value: boolean}): void {
    this.baseForm.get('mainBase').setValue(selected.value);
  }

  public getMainBaseValue(): boolean {
    return !!this.baseForm.get('mainBase').value;
  }

  public disabledMainBase(): boolean {
    return !this.enabledAircraftBase && (!this.aircraftBase || !this.aircraftBase.mainBase);
  }
}
