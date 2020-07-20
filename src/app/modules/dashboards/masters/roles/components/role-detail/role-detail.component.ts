import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Role } from '../../models/role';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Task } from '../../../tasks/models/task';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
})
export class RoleDetailComponent implements OnInit {
  @Input()
  public taskColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public taskColumnsData: Array<RowDataModel> = [];
  @Input()
  public title: string;
  @Input()
  public tasks: Task[];
  @Input()
  public set roleDetail(role: Role) {
    this._roleDetail = { ...role };
    if (role.id) {
      this.roleNameControl.setValue(this._roleDetail.name);
    } else {
      this.roleNameControl.reset();
    }
  }
  @Input()
  public pagination:PaginationModel;
  @Output()
  public saveRole: EventEmitter<Role> = new EventEmitter();

  private _roleDetail: Role;

  public roleNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  public hasRoleNameControlErrors() {
    return (
      this.roleNameControl.invalid &&
      (this.roleNameControl.dirty || this.roleNameControl.touched)
    );
  }

  public onSaveRole() {
    this.saveRole.next({
      ...this._roleDetail,
      name: this.roleNameControl.value,
    });
  }

  public taskAssignedChanged(event: { id: string; selectedItem: number }) {
    const taskId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasRoleTaskAssigned(this._roleDetail, taskId)) {
      this._roleDetail.tasks = this._roleDetail.tasks.filter(
        (task: Task) => task.id !== taskId
      );
    } else {
      const taskToAdd = this.tasks[event.selectedItem];
      this._roleDetail.tasks = [...this._roleDetail.tasks, taskToAdd];
    }
  }

  private hasRoleTaskAssigned(role: Role, taskId: number): boolean {
    return role.tasks.some((task: Task) => task.id === taskId);
  }
}
