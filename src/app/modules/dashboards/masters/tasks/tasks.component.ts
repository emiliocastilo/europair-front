import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import {
  BarButtonType,
  BarButton,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { TasksTableAdapterService } from './services/tasks-table-adapter.service';
import { TasksService } from './services/tasks.service';
import { Screen } from './models/screen';
import { Task, EMPTY_TASK } from './models/task';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [TasksTableAdapterService],
})
export class TasksComponent implements OnInit {
  @ViewChild(TaskDetailComponent, { static: true, read: ElementRef })
  public taskDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public taskColumnsHeader: ColumnHeaderModel[] = [];
  public screenColumnsHeader: ColumnHeaderModel[] = [];
  public taskColumnsData: RowDataModel[] = [];
  public screenColumnsData: RowDataModel[] = [];
  public taskDetailScreenColumnsData: RowDataModel[] = [];
  public taskColumnsPagination: PaginationModel;
  public screenColumnsPagination: PaginationModel;
  public pageTitle = 'Tareas';
  public tasksSelectedCount = 0;
  public screens: Screen[];
  private tasks: Task[];
  public taskDetailTitle: string;
  public taskSelected: Task = EMPTY_TASK;
  private selectedItem: number = -1;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva tarea' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];

  private readonly EDIT_TASK_TITLE = 'Editar tarea';
  private readonly CREATE_TASK_TITLE = 'Crear tarea';

  private newTask = () => {
    this.taskDetailTitle = this.CREATE_TASK_TITLE;
    this.initializeTaskDetailModal(this.CREATE_TASK_TITLE, { ...EMPTY_TASK });
    this.modalService.openModal();
  };
  private barButtonActions = {
    new: this.newTask,
  };

  private editTask = (selectedItem: number) => {
    this.initializeTaskDetailModal(this.EDIT_TASK_TITLE, {
      ...this.tasks[selectedItem],
    });
    this.modalService.openModal();
  };
  private deleteTask = (selectedItem: number) => {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };
  private taskTableActions = {
    edit: this.editTask,
    delete: this.deleteTask,
  };

  constructor(
    private modalService: ModalService,
    private taskService: TasksService,
    private taskTableAdapterService: TasksTableAdapterService
  ) {}

  ngOnInit(): void {
    this.initializeTaskTable();
    this.initializeScreenTable();
  }

  private initializeTaskTable() {
    this.taskColumnsHeader = this.taskTableAdapterService.getTaskColumnsHeader();
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks['content'];
      this.taskColumnsData = this.taskTableAdapterService.getTaskTableDataFromTasks(
        tasks['content']
      );
      if (this.selectedItem >= 0) {
        this.onTaskSelected(this.selectedItem);
      }
      this.taskColumnsPagination = this.taskTableAdapterService.getPagination();
      this.taskColumnsPagination.lastPage = this.taskColumnsData.length/this.taskColumnsPagination.elememtsPerpage;
    });
  }

  private initializeScreenTable() {
    this.screenColumnsHeader = this.taskTableAdapterService.getScreenColumnsHeader();
    this.taskService
      .getScreens()
      .subscribe((screens) => {
        this.screens = screens['content'];
        this.screenColumnsPagination = this.taskTableAdapterService.getPagination();
        this.screenColumnsPagination.lastPage = this.screens.length/this.screenColumnsPagination.elememtsPerpage
      });
  }

  private initializeTaskDetailModal(
    taskDetailTitle: string,
    taskSelected: Task
  ) {
    this.taskDetailTitle = taskDetailTitle;
    this.taskSelected = taskSelected;
    this.taskDetailScreenColumnsData = this.taskTableAdapterService.getScreenTableDataForTask(
      this.screens,
      this.taskSelected,
      true,
      'assigned-editable-'
    );
    this.initializeModal(this.taskDetailModal);
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onTaskSelected(selectedIndex: number) {
    this.selectedItem = selectedIndex;
    this.screenColumnsData = this.taskTableAdapterService.getScreenTableDataForTask(
      this.screens,
      this.tasks[selectedIndex],
      false,
      'assigned-'
    );
  }

  public onTaskAction(action: { actionId: string; selectedItem: number }) {
    this.taskTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onConfirmDeleteTask() {
    this.taskService
      .deleteTask(this.tasks[this.selectedItem])
      .subscribe((response) => {
        console.log(response);
        this.initializeTaskTable();
        this.screenColumnsData = [];
      });
  }

  public onSaveTask(task: Task) {
    this.modalService.closeModal();
    this.taskService.saveTask(task).subscribe((task) => {
      console.log(task);
      this.initializeTaskTable();
      this.initializeScreenTable();
    });
  }
}
