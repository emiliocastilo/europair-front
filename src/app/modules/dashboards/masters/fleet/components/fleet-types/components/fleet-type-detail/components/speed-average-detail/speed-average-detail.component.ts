import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FleetTypesService } from '../../../../services/fleet-types.service';
import { MeasureType } from 'src/app/core/models/base/measure';

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

  public measuresType: Array<MeasureType> = [];

  constructor(private fleetTypeService: FleetTypesService) {}

  ngOnInit(): void {
    // TODO: Obtener de servicio
    this.measuresType = [
      MeasureType.FOOT,
      MeasureType.INCH,
      MeasureType.KILOMETER,
      MeasureType.METER,
      MeasureType.NAUTIC_MILE,
    ];
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
