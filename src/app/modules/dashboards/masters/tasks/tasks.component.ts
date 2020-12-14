import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { BarButtonType, BarButton } from 'src/app/core/models/menus/button-bar/bar-button';
import { TasksTableAdapterService } from './services/tasks-table-adapter.service';
import { TasksService } from './services/tasks.service';
import { Screen } from './models/screen';
import { Task, EMPTY_TASK } from './models/task';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Observable, forkJoin } from 'rxjs';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { FormBuilder } from '@angular/forms';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [TasksTableAdapterService],
})
export class TasksComponent implements OnInit {
  @ViewChild(TaskDetailComponent, { static: true, read: ElementRef })
  public taskDetailModal: ElementRef;
  @ViewChild('deleteTask', { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild('deleteMultipleTasks', { static: true, read: ElementRef })
  public confirmMultipleDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public taskAdvancedSearch: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public taskSortMenu: ElementRef;

  public taskColumnsHeader: ColumnHeaderModel[] = [];
  public screenColumnsHeader: ColumnHeaderModel[] = [];
  public taskColumnsData: RowDataModel[] = [];
  public screenColumnsData: RowDataModel[] = [];
  public taskDetailScreenColumnsData: RowDataModel[] = [];
  public taskDetailScreenColumnsHeader: ColumnHeaderModel[] = [];
  public taskColumnsPagination: PaginationModel;
  public screenColumnsPagination: PaginationModel;
  public taskDetailScreenPagination: PaginationModel;
  public pageTitle = 'Tareas';
  public screens: Screen[];
  public tasks: Task[];
  public taskDetailTitle: string;
  public taskSelected: Task = EMPTY_TASK;
  public showMobileSearchBar: boolean = false;
  private selectedItem: number = -1;
  public selectedItems: number[] = [];
  public barButtons: BarButton[];
  public translationParams = {};

  private newTask = () => {
    this.taskDetailTitle = this.translateService.instant('TASKS.CREATE');
    this.initializeTaskDetailModal(this.taskDetailTitle, { ...EMPTY_TASK });
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private deleteSelectedTasks = () => {
    this.initializeModal(this.confirmMultipleDeleteModal);
    this.modalService.openModal();
  };

  private barButtonActions = {
    new: this.newTask,
    search: this.toggleSearchBar,
    delete_selected: this.deleteSelectedTasks,
  };

  private editTask = (selectedItem: number) => {
    this.initializeTaskDetailModal(this.translateService.instant('TASKS.EDIT_TASK'), {
      ...this.tasks[selectedItem],
    });
    this.modalService.openModal();
  };
  private deleteTask = (selectedItem: number) => {
    this.selectedItem = selectedItem;
    this.translationParams = {task: this.tasks[selectedItem]?.name};
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };
  private taskTableActions = {
    edit: this.editTask,
    delete: this.deleteTask,
  };

  public taskAdvancedSearchForm = this.fb.group({
    filter_name: [''],
  });
  public taskSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private modalService: ModalService,
    private taskService: TasksService,
    private taskTableAdapterService: TasksTableAdapterService,
    private fb: FormBuilder,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initializeTablesPagination();
    this.obtainTranslateText();
    this.initializeTaskTable();
    this.initializeScreenTable();
    this.initializeTableHeaders();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newTask: this.translateService.get('TASKS.NEW'),
      deleteTask: this.translateService.get('TASKS.DELETE'),
      searchTask: this.translateService.get('TASKS.SEARCH')
    }).subscribe((data: { newTask: string, deleteTask: string, searchTask: string }) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newTask },
        { type: BarButtonType.SEARCH, text: data.searchTask },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteTask },
      ];
    });
  }

  private initializeTablesPagination() {
    this.taskColumnsPagination = this.taskTableAdapterService.getPagination();
    this.screenColumnsPagination = this.taskTableAdapterService.getPagination();
    this.taskDetailScreenPagination = this.taskTableAdapterService.getPagination();
  }

  private initializeTableHeaders() {
    this.taskColumnsHeader = this.taskTableAdapterService.getTaskColumnsHeader();
    this.screenColumnsHeader = this.taskTableAdapterService.getScreenColumnsHeader();
    this.taskDetailScreenColumnsHeader = this.taskTableAdapterService.getTaskDetailScreenColumnsHeader();
  }

  private initializeTaskTable(searchFilter?: SearchFilter) {
    this.taskService.getTasks(searchFilter).subscribe((tasks) => {
      this.tasks = tasks['content'];
      this.taskColumnsData = this.taskTableAdapterService.getTaskTableDataFromTasks(
        tasks['content']
      );
      this.taskColumnsPagination = {...this.taskColumnsPagination, 
        lastPage: this.taskColumnsData.length / this.taskColumnsPagination.elementsPerPage
      };
    });
  }

  private initializeScreenTable(searchFilter?: SearchFilter) {
    this.taskService.getScreens(searchFilter).subscribe((screens) => {
      this.screens = screens['content'];
      this.screenColumnsPagination = {...this.screenColumnsPagination, 
        lastPage: this.screens.length / this.screenColumnsPagination.elementsPerPage
      };
      if(this.taskSelected) {
        this.taskDetailScreenColumnsData = this.taskTableAdapterService.getScreenTableDataForTask(
          this.screens,
          this.taskSelected,
          true,
          'assigned-editable-'
        );
      }
    });
  }

  private initializeTaskDetailModal(
    taskDetailTitle: string,
    taskSelected: Task
  ) {
    this.taskDetailTitle = taskDetailTitle;
    this.taskSelected = taskSelected;
    this.updateTaskDetailSceenTable(this.screens);
    this.initializeModal(this.taskDetailModal);
  }

  public onTaskDetailScreenFilterChanged(screenFilter: SearchFilter): void {
    this.taskService.getScreens(screenFilter).subscribe((filteredScreens) => {
      this.updateTaskDetailSceenTable(filteredScreens.content);
    });
  }

  private updateTaskDetailSceenTable(screens: Screen[]) {
    this.taskDetailScreenColumnsData = this.taskTableAdapterService.getScreenTableDataForTask(
      screens,
      this.taskSelected,
      true,
      'assigned-editable-'
    );
    this.taskDetailScreenPagination = {
      ...this.taskDetailScreenPagination,
      lastPage: this.taskDetailScreenColumnsData.length / this.taskDetailScreenPagination.elementsPerPage
    }
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onTasksSelected(selectedItems: number[]) {
    this.selectedItems = selectedItems;
    if (this.selectedItems.length === 1) {
      this.screenColumnsData = this.taskTableAdapterService.getScreenOfTask(
        this.tasks[selectedItems[0]],
        false,
        'assigned-'
      );
    } else {
      this.screenColumnsData = [];
    }
    this.screenColumnsPagination = {
      ...this.screenColumnsPagination, 
      lastPage: this.screenColumnsData.length / this.screenColumnsPagination.elementsPerPage
    };
  }

  public onTaskAction(action: { actionId: string; selectedItem: number }) {
    this.selectedItem = action.selectedItem;
    this.taskTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onConfirmDeleteTask() {
    this.taskService
      .deleteTask(this.tasks[this.selectedItem])
      .subscribe((response) => {
        this.filterTaskTable();
        this.screenColumnsData = [];
      });
  }

  public onConfirmDeleteMultipleTasks() {
    console.log('DELETING TASKS ', this.selectedItems.map(item => this.tasks[item].id));
    // this.selectedItems.forEach(item => console.log('DELETING ', this.tasks[item]));
  }

  public onSaveTask(task: Task) {
    this.modalService.closeModal();
    const save: Observable<Task> = task.id ? this.taskService.editTask(task) : this.taskService.addTask(task);
    save.subscribe((task) => {
      this.filterTaskTable();
    });
  }

  public onFilterTasks(taskFilter: ColumnFilter) {
    const filter = {};
    filter[taskFilter.identifier] = taskFilter.searchTerm;
    this.taskAdvancedSearchForm.patchValue(filter);
    this.filterTaskTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.taskAdvancedSearchForm.patchValue({ filter_name: searchTerm });
    this.filterTaskTable();
  }

  public onMobileAdvancedSearch() {
    this.filterTaskTable();
  }

  public onSortTasks(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.taskSortForm.patchValue({ sort: sort });
    this.filterTaskTable();
  }

  public onMobileSort(): void {
    this.filterTaskTable();
  }

  private filterTaskTable(): void {
    const filter = {
      ...this.taskAdvancedSearchForm.value,
      ...this.taskSortForm.value,
    };
    this.initializeTaskTable(filter);
  }

  public onOpenAdvancedSearch(): void {
    this.initializeModal(this.taskAdvancedSearch);
    this.modalService.openModal();
  }

  public onOpenSortMenu(): void {
    this.initializeModal(this.taskSortMenu);
    this.modalService.openModal();
  }
}
