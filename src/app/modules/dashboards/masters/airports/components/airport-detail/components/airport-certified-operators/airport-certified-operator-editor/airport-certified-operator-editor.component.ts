import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Certification } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';

@Component({
  selector: 'app-airport-certified-operator-editor',
  templateUrl: './airport-certified-operator-editor.component.html',
  styleUrls: ['./airport-certified-operator-editor.component.scss'],
})
export class AirportCertifiedOperatorEditorComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public certifiedOperator: Certification;
  @Input()
  public certifiedOperatorForm: FormGroup;
  @Output()
  public editCertifiedOperator = new EventEmitter<Certification>();

  constructor() {}

  ngOnInit(): void {}

  public onEditCertifiedOperator(): void {
    this.editCertifiedOperator.next({
      ...this.certifiedOperatorForm.value,
      operator: this.certifiedOperator?.operator,
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
