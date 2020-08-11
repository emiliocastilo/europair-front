import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Operator, EMPTY_OPERATOR } from '../../models/Operator.model';

@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator-detail.component.html',
  styleUrls: ['./operator-detail.component.scss'],
})
export class OperatorDetailComponent implements OnInit {
  @Input()
  public title: string;

  @Input()
  public operatorCertificationsColumnsHeader: ColumnHeaderModel[] = [];

  @Input()
  public operatorCertificationsColumnsData: RowDataModel[] = [];

  @Input()
  public operatorCertificationsColumnsPagination: PaginationModel;

  @Input()
  public operatorObservationsColumnsHeader: ColumnHeaderModel[] = [];

  @Input()
  public operatorObservationsColumnsData: RowDataModel[] = [];

  @Input()
  public operatorObservationsColumnsPagination: PaginationModel;

  @Input()
  public operatorForm: FormGroup;

  @Input()
  public set operatorDetail(operatorDetail: Operator) {
    this._operatorDetail = { ...operatorDetail };
  }

  @Output()
  public saveOperator: EventEmitter<Operator> = new EventEmitter();

  public _operatorDetail: Operator = { ...EMPTY_OPERATOR };

  constructor() {}

  ngOnInit(): void {}

  // public userRoleAssignedChanged(event: { id: string; selectedItem: number }) {
  //   const roleId = +event.id.substring(event.id.lastIndexOf('-') + 1);
  //   if (this.hasUserRoleAssigned(this._operatorDetail, roleId)) {
  //     this._operatorDetail.roles = this._operatorDetail.roles.filter(
  //       (role: Role) => role.id !== roleId
  //     );
  //   } else {
  //     const roleToAdd = this.roles[event.selectedItem];
  //     this._operatorDetail.roles = [...this._operatorDetail.roles, roleToAdd];
  //   }
  // }

  // public userTaskAssignedChanged(event: { id: string; selectedItem: number }) {
  //   const taskId = +event.id.substring(event.id.lastIndexOf('-') + 1);
  //   if (this.hasUserTaskAssigned(this._operatorDetail, taskId)) {
  //     this._operatorDetail.tasks = this._operatorDetail.tasks.filter(
  //       (task: Task) => task.id !== taskId
  //     );
  //   } else {
  //     const taskToAdd = this.tasks[event.selectedItem];
  //     this._operatorDetail.tasks = [...this._operatorDetail.tasks, taskToAdd];
  //   }
  // }

  public onSaveUser() {
    console.log({
      ...this._operatorDetail,
      ...this.operatorForm.value,
    });
    this.saveOperator.next({
      ...this._operatorDetail,
      ...this.operatorForm.value,
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.operatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.operatorForm.get(controlName);
    return control && control.hasError(errorName);
  }

  // private hasUserRoleAssigned(user: User, roleId: number): boolean {
  //   return user.roles.some((role: Role) => role.id === roleId);
  // }

  // private hasUserTaskAssigned(user: User, taskId: number): boolean {
  //   return user.tasks.some((task: Task) => task.id === taskId);
  // }
}
