import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AircraftObservation } from '../../../../models/Aircraft.model';

@Component({
  selector: 'app-observation-detail',
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.scss'],
})
export class ObservationDetailComponent implements OnInit {
  @Input()
  public title: string;

  @Input()
  public observationForm: FormGroup;

  @Output()
  public saveObservation = new EventEmitter<AircraftObservation>();

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
