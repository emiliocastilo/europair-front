import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observation } from 'src/app/modules/dashboards/masters/airports/models/airport';

@Component({
  selector: 'app-airport-observation-detail',
  templateUrl: './airport-observation-detail.component.html',
  styleUrls: ['./airport-observation-detail.component.scss'],
})
export class AirportObservationDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public observationForm: FormGroup;

  @Output()
  public saveObservation = new EventEmitter<Observation>();

  constructor() {}

  ngOnInit(): void {}

  public onSaveObservation() {
    this.saveObservation.next(this.observationForm.value);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.observationForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.observationForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
