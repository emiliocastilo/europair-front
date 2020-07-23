import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { User, EMPTY_USER } from '../../models/user';
import { Role } from '../../../roles/models/role';
import { Task } from '../../../tasks/models/task';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public userTaskColumnsHeader: ColumnHeaderModel[] = [];
  @Input()
  public userTaskColumnsData: RowDataModel[] = [];
  @Input()
  public userTaskColumnsPagination: PaginationModel;
  @Input()
  public userRoleColumnsHeader: ColumnHeaderModel[] = [];
  @Input()
  public userRoleColumnsData: RowDataModel[] = [];
  @Input()
  public userRoleColumnsPagination: PaginationModel;
  @Input()
  public userForm: FormGroup;
  @Input()
  public set userDetail(userDetail: User) {
    this._userDetail = { ...userDetail };
  }
  @Input()
  public roles: Role[];
  @Input()
  public tasks: Task[];
  @Output()
  public saveUser: EventEmitter<User> = new EventEmitter();

  public _userDetail: User = { ...EMPTY_USER };

  constructor() {}

  ngOnInit(): void {}

  public userRoleAssignedChanged(event: { id: string; selectedItem: number }) {
    const roleId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasUserRoleAssigned(this._userDetail, roleId)) {
      this._userDetail.roles = this._userDetail.roles.filter(
        (role: Role) => role.id !== roleId
      );
    } else {
      const roleToAdd = this.roles[event.selectedItem];
      this._userDetail.roles = [...this._userDetail.roles, roleToAdd];
    }
  }

  public userTaskAssignedChanged(event: { id: string; selectedItem: number }) {
    const taskId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasUserTaskAssigned(this._userDetail, taskId)) {
      this._userDetail.tasks = this._userDetail.tasks.filter(
        (task: Task) => task.id !== taskId
      );
    } else {
      const taskToAdd = this.tasks[event.selectedItem];
      this._userDetail.tasks = [...this._userDetail.tasks, taskToAdd];
    }
  }

  public onSaveUser() {
    console.log({
      ...this._userDetail,
      ...this.userForm.value,
    });
    this.saveUser.next({
      ...this._userDetail,
      ...this.userForm.value,
    });
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorName);
  }

  private hasUserRoleAssigned(user: User, roleId: number): boolean {
    return user.roles.some((role: Role) => role.id === roleId);
  }

  private hasUserTaskAssigned(user: User, taskId: number): boolean {
    return user.tasks.some((task: Task) => task.id === taskId);
  }
}
