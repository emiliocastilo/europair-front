import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MEASURE_LIST, MeasureType } from 'src/app/core/models/base/measure';
import { Track } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { TranslateService } from '@ngx-translate/core';

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

  public measureList: Array<{ label: string, value: MeasureType }>;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.get('MEASURES.UNITS').subscribe((data: Array<string>) => {
      this.measureList = MEASURE_LIST.map((measureValue: string) => {
        return {
          label: data[measureValue],
          value: MeasureType[measureValue]
        }
      });
    });
  }

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
