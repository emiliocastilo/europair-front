import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Role } from '../models/role';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { Task } from '../../tasks/models/task';

@Injectable()
export class RolesTableAdapterService {
  constructor() {}

  public getRoleColumnsHeader(): ColumnHeaderModel[] {
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
        'Rol',
        new ColumnHeaderSizeModel('5', '7', '7')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('6', '4', '4')
      ),
    ];
  }

  public getTaskColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'Tarea',
        new ColumnHeaderSizeModel('8', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignada',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
    ];
  }

  public getRoleTableDataFromRoles(roles: Role[]): RowDataModel[] {
    const roleTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    roles.forEach((role: Role) => {
      const taskRow: RowDataModel = new RowDataModel();
      taskRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      taskRow.pushColumn(new ColumnDataModel('text', role.name));
      taskRow.pushColumn(new ColumnDataModel('actions', actions));
      roleTableData.push(taskRow);
    });
    return roleTableData;
  }

  public getTaskTableDataForRole(
    tasks: Task[],
    role: Role,
    editable: boolean,
    idPrefix: string
  ): RowDataModel[] {
    const taskTableData: Array<RowDataModel> = new Array<RowDataModel>();
    tasks.forEach((task: Task) => {
      const screenRow: RowDataModel = new RowDataModel();
      screenRow.pushColumn(new ColumnDataModel('text', task.name));
      screenRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + task.id,
          check: this.hasRoleAssignedTask(role, task),
          disable: !editable,
        })
      );
      taskTableData.push(screenRow);
    });
    return taskTableData;
  }

  private hasRoleAssignedTask(role: Role, task: Task): boolean {
    return !!(
      role &&
      role.tasks &&
      role.tasks.find((assignedTask) => assignedTask.id === task.id)
    );
  }
}
