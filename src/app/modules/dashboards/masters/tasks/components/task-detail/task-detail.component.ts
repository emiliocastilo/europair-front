import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { Screen } from '../../models/screen';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  @Input()
  public screenColumnsHeader: Array<ColumnHeaderModel> = [];
  @Input()
  public screenColumnsData: Array<RowDataModel> = [];
  @Input()
  public title: string;
  @Input()
  public screens: Screen[];
  @Input()
  public set taskDetail(task: Task) {
    this._taskDetail = { ...task };
    if (task.id) {
      this.taskNameControl.setValue(this._taskDetail.name);
    } else {
      this.taskNameControl.reset();
    }
  }
  @Input() pagination: PaginationModel;
  @Output()
  public saveTask: EventEmitter<Task> = new EventEmitter();
  @Output()
  public screenFilterChanged: EventEmitter<SearchFilter> = new EventEmitter();
  public screenFilter: SearchFilter = {};
  private _taskDetail: Task;

  public taskNameControl: FormControl = this.fb.control(
    { value: '', disabled: false },
    Validators.required
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  public hasTaskNameControlErrors() {
    return (
      this.taskNameControl.invalid &&
      (this.taskNameControl.dirty || this.taskNameControl.touched)
    );
  }

  public onSaveTask() {
    this.saveTask.next({
      ...this._taskDetail,
      name: this.taskNameControl.value,
    });
  }

  public screenAssignedChanged(event: { id: string; selectedItem: number }) {
    const screenId = +event.id.substring(event.id.lastIndexOf('-') + 1);
    if (this.hasTaskScreenAssigned(this._taskDetail, screenId)) {
      this._taskDetail.screens = this._taskDetail.screens.filter(
        (screen: Screen) => screen.id !== screenId
      );
    } else {
      const screenToAdd = this.screens.find((screen: Screen) => screen.id === screenId);
      this._taskDetail.screens = [...this._taskDetail.screens, screenToAdd];
    }
  }

  private hasTaskScreenAssigned(task, screenId) {
    return task.screens.some((screen: Screen) => screen.id === screenId);
  }

  public onFilterScreens(filter: ColumnFilter) {
    this.screenFilter[filter.identifier] = filter.searchTerm;
    this.screenFilterChanged.next(this.screenFilter);
  }

  public onSortScreens(sortByColumn: SortByColumn) {
    this.screenFilter['sort'] = sortByColumn.column + ',' + sortByColumn.order;
    this.screenFilterChanged.next(this.screenFilter);
  }
}
