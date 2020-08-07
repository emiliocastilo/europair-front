import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MEASURE_LIST } from 'src/app/core/models/base/measure';
import { Track } from 'src/app/modules/dashboards/masters/airports/models/airport';

@Component({
  selector: 'app-airport-runway-detail',
  templateUrl: './airport-runway-detail.component.html',
  styleUrls: ['./airport-runway-detail.component.scss'],
})
export class AirportRunwayDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public runwayForm: FormGroup;

  @Output()
  public saveRunway = new EventEmitter<Track>();

  public readonly measureList = MEASURE_LIST;

  constructor() {}

  ngOnInit(): void {}

  public onSaveRunway() {
    this.saveRunway.next(this.runwayForm.value);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.runwayForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.runwayForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
