import { Injectable, OnDestroy } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { Task } from '../models/task';
import { Screen } from '../models/screen';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';

@Injectable()
export class TasksTableAdapterService implements OnDestroy {
  constructor() {}

  ngOnDestroy(): void {}

  public getTaskColumnsHeader(): ColumnHeaderModel[] {
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
        'Tarea',
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

  public getScreenColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'Pantalla',
        new ColumnHeaderSizeModel('8', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignado',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
    ];
  }

  public getTaskTableDataFromTasks(tasks: Task[]): RowDataModel[] {
    const taskTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    tasks.forEach((task: Task) => {
      const taskRow: RowDataModel = new RowDataModel();
      taskRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      taskRow.pushColumn(new ColumnDataModel('text', task.name));
      taskRow.pushColumn(new ColumnDataModel('actions', actions));
      taskTableData.push(taskRow);
    });
    return taskTableData;
  }

  public getScreenTableDataForTask(
    screens: Screen[],
    task: Task,
    editable: boolean,
    idPrefix: string
  ): RowDataModel[] {
    const screenTableData: Array<RowDataModel> = new Array<RowDataModel>();
    screens.forEach((screen: Screen) => {
      const screenRow: RowDataModel = new RowDataModel();
      screenRow.pushColumn(new ColumnDataModel('text', screen.name));
      screenRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + screen.id,
          check: this.hasTaskAssignedScreen(task, screen),
          disable: !editable,
        })
      );
      screenTableData.push(screenRow);
    });
    return screenTableData;
  }

  private hasTaskAssignedScreen(task: Task, screen: Screen): boolean {
    return !!(
      task &&
      task.screens &&
      task.screens.find((assignedScreen) => screen.id === assignedScreen.id)
    );
  }
}
