import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Aircraft, EMPTY_AIRCRAFT } from '../../models/Aircraft.model';

@Component({
  selector: 'app-aircraft-detail',
  templateUrl: './aircraft-detail.component.html',
  styleUrls: ['./aircraft-detail.component.scss'],
})
export class AircraftDetailComponent implements OnInit {
  public readonly selectItemValue: string = 'id';
  public readonly selectItemDescription: string = 'name';
  public readonly selectId: string = 'country';
  public readonly selectLabel: string = 'País';
  public readonly selectPlaceholder: string = 'Selecciona un operador';

  public operators: any[] = [];
  public aircraftTypes: any[] = [];

  @Input()
  public title: string;

  @Input()
  public aircraftBaseColumnsHeader: ColumnHeaderModel[] = [];
  @Input()
  public aircraftBaseColumnsData: RowDataModel[] = [];
  @Input()
  public aircraftBaseColumnsPagination: PaginationModel;

  @Input()
  public aircraftForm: FormGroup;

  @Input()
  public set aircraftDetail(aircraftDetail: Aircraft) {
    this._aircraftDetail = { ...aircraftDetail };
  }

  @Output()
  public saveAircraft: EventEmitter<Aircraft> = new EventEmitter();

  public _aircraftDetail: Aircraft = { ...EMPTY_AIRCRAFT };

  constructor() {}

  ngOnInit(): void {}

  public onSaveAircraft() {
    console.log({
      ...this._aircraftDetail,
      ...this.aircraftForm.value,
    });
    this.saveAircraft.next({
      ...this._aircraftDetail,
      ...this.aircraftForm.value,
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.aircraftForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.aircraftForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
