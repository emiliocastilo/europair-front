import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  MeasureType,
  MEASURE_SPEED_LIST,
  MEASURE_LIST,
} from 'src/app/core/models/base/measure';

@Component({
  selector: 'app-speed-average-detail',
  templateUrl: './speed-average-detail.component.html',
  styleUrls: ['./speed-average-detail.component.scss'],
})
export class SpeedAverageDetailComponent implements OnInit {
  @Input()
  public title: string;

  @Input()
  public speedAverageForm: FormGroup;

  @Output()
  public saveSpeed = new EventEmitter<any>();

  public measureList: Array<{ label: string; value: MeasureType }>;
  public measureSpeedList: Array<{ label: string; value: MeasureType }>;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService
      .get('MEASURES.UNITS')
      .subscribe((data: Array<string>) => {
        this.measureList = MEASURE_LIST.map((measureValue: string) => {
          return {
            label: data[measureValue],
            value: MeasureType[measureValue],
          };
        });
        this.measureSpeedList = MEASURE_SPEED_LIST.map(
          (measureValue: string) => {
            return {
              label: data[measureValue],
              value: MeasureType[measureValue],
            };
          }
        );
      });
  }

  public onSaveSpeed() {
    this.saveSpeed.next(this.speedAverageForm.value);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.speedAverageForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.speedAverageForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
