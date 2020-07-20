import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { User } from '../models/user';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { Role } from '../../roles/models/role';
import { Task } from '../../tasks/models/task';

@Injectable()
export class UsersTableAdapterService {
  constructor() {}

  public getUserColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Usuario',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Apellidos',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Email',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
    ];
  }

  public getUserTableDataFromUsers(users: User[]): RowDataModel[] {
    const taskTableData: RowDataModel[] = new Array<RowDataModel>();
    const taskActions: ColumnActionsModel[] = new Array();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('visibility', 'view', 'Ver', 'green'));
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    users.forEach((user: User) => {
      const taskRow: RowDataModel = new RowDataModel();
      taskRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      taskRow.pushColumn(new ColumnDataModel('text', user.username));
      taskRow.pushColumn(new ColumnDataModel('text', user.name));
      taskRow.pushColumn(new ColumnDataModel('text', user.surname));
      taskRow.pushColumn(new ColumnDataModel('text', user.email));
      taskRow.pushColumn(new ColumnDataModel('actions', actions));
      taskTableData.push(taskRow);
    });
    return taskTableData;
  }

  public getUserRoleColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'Rol',
        new ColumnHeaderSizeModel('10', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignado',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getUserRoleTableData(
    roles: Role[],
    userRoles: Role[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const roleTableData: Array<RowDataModel> = new Array<RowDataModel>();
    roles.forEach((role: Role) => {
      const roleRow: RowDataModel = new RowDataModel();
      roleRow.pushColumn(new ColumnDataModel('text', role.name));
      roleRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + role.id,
          check: this.hasUserAssignedRole(userRoles, role),
          disable: !editable,
        })
      );
      roleTableData.push(roleRow);
    });
    return roleTableData;
  }

  private hasUserAssignedRole(userRoles: Role[], role: Role): boolean {
    return !!(
      userRoles && userRoles.find((userRole) => userRole.id === role.id)
    );
  }

  public getUserTaskColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'Tarea',
        new ColumnHeaderSizeModel('10', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignada',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getUserTaskTableData(
    tasks: Task[],
    userTasks: Task[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const taskTableData: Array<RowDataModel> = new Array<RowDataModel>();
    tasks.forEach((task: Task) => {
      const taskRow: RowDataModel = new RowDataModel();
      taskRow.pushColumn(new ColumnDataModel('text', task.name));
      taskRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + task.id,
          check: this.hasUserAssignedTask(userTasks, task),
          disable: !editable,
        })
      );
      taskTableData.push(taskRow);
    });
    return taskTableData;
  }

  private hasUserAssignedTask(userTasks: Task[], task: Task): boolean {
    return !!(
      userTasks && userTasks.find((userTask) => userTask.id === task.id)
    );
  }
}
