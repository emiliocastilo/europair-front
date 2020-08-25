import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AircraftBase } from '../../../../models/Aircraft.model';
import { AirportsService } from 'src/app/modules/dashboards/masters/airports/services/airports.service';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';

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

  @Output()
  public saveBase = new EventEmitter<AircraftBase>();

  public airports: Airport[];

  constructor(private airportService: AirportsService) {}

  ngOnInit(): void {}

  public onSaveBase() {
    this.saveBase.next(this.baseForm.value);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.baseForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
