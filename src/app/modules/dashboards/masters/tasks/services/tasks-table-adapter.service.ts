import { Injectable, OnDestroy } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { Task } from '../models/task';
import { Screen } from '../models/screen';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable()
export class TasksTableAdapterService implements OnDestroy {
  constructor() {}

  ngOnDestroy(): void {}

  public getTaskColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'selectAll',
        '',
        new ColumnHeaderSizeModel('1', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'search',
        'TASKS.TASK',
        new ColumnHeaderSizeModel('9', '6', '7'),
        'filter_name',
        'name'
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getScreenColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'TASKS.SCREEN',
        new ColumnHeaderSizeModel('10', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'TASKS.ASIGNED',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }

  public getTaskTableDataFromTasks(tasks: Task[]): RowDataModel[] {
    const taskTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel(
        'create',
        'edit',
        'TASKS.EDIT',
        'europair-icon-blue'
      )
    );
    actions.push(
      new ColumnActionsModel('delete', 'delete', 'TASKS.DELETE', 'red')
    );
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

  public getTaskDetailScreenColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'detail-screen-header',
        'search',
        'TASKS.SCREEN',
        new ColumnHeaderSizeModel('10', '8', '8'),
        'filter_name',
        'name'
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'TASKS.ASIGNED',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
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

  public getScreenOfTask(
    task: Task,
    editable: boolean,
    idPrefix: string
  ): RowDataModel[] {
    const screenTableData: Array<RowDataModel> = new Array<RowDataModel>();
    task.screens.forEach((screen: Screen) => {
      const screenRow: RowDataModel = new RowDataModel();
      screenRow.pushColumn(new ColumnDataModel('text', screen.name));
      screenRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + screen.id,
          check: true,
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
