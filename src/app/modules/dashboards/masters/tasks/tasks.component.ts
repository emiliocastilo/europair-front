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
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
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
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
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
  public pageTitle = 'Tareas';
  public tasksSelectedCount = 0;
  public screens: Screen[];
  private tasks: Task[];
  public taskDetailTitle: string;
  public taskSelected: Task = EMPTY_TASK;
  public showMobileSearchBar: boolean = false;
  private selectedItem: number = -1;
  public barButtons: BarButton[];

  private newTask = () => {
    this.taskDetailTitle = this.translateService.instant('TASKS.CREATE');
    this.initializeTaskDetailModal(this.taskDetailTitle, { ...EMPTY_TASK });
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };
  private barButtonActions = {
    new: this.newTask,
    search: this.toggleSearchBar,
  };

  private editTask = (selectedItem: number) => {
    this.initializeTaskDetailModal(this.translateService.instant('TASKS.EDIT_TASK'), {
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

  public taskAdvancedSearchForm = this.fb.group({
    name: [''],
  });
  public taskSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private modalService: ModalService,
    private taskService: TasksService,
    private taskTableAdapterService: TasksTableAdapterService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
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
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteTask },
        { type: BarButtonType.SEARCH, text: data.searchTask },
      ];
    });
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
      if (this.selectedItem >= 0) {
        this.onTaskSelected(this.selectedItem);
      }
      this.taskColumnsPagination = this.taskTableAdapterService.getPagination();
      this.taskColumnsPagination.lastPage =
        this.taskColumnsData.length /
        this.taskColumnsPagination.elementsPerPage;
    });
  }

  private initializeScreenTable() {
    this.taskService.getScreens().subscribe((screens) => {
      this.screens = screens['content'];
      this.screenColumnsPagination = this.taskTableAdapterService.getPagination();
      this.screenColumnsPagination.lastPage =
        this.screens.length / this.screenColumnsPagination.elementsPerPage;
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
    this.screenColumnsData = this.taskTableAdapterService.getScreenOfTask(
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
    const save: Observable<Task> = task.id ? this.taskService.editTask(task) : this.taskService.addTask(task);
    save.subscribe((task) => {
      console.log(task);
      this.initializeTaskTable();
      this.initializeScreenTable();
    });
  }

  public onFilterTasks(taskFilter: ColumnFilter) {
    const filter = {};
    filter[taskFilter.identifier] = taskFilter.searchTerm;
    console.log('FILTER BY', filter);
    this.taskAdvancedSearchForm.patchValue(filter);
    this.filterTaskTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.taskAdvancedSearchForm.patchValue({ name: searchTerm });
    console.log('FILTER MOBILE BY', this.taskAdvancedSearchForm.value);
    this.filterTaskTable();
  }

  public onMobileAdvancedSearch() {
    console.log('ADVANCED FILTER BY', this.taskAdvancedSearchForm.value);
    this.filterTaskTable();
  }

  public onSortTasks(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.taskSortForm.patchValue({ sort: sort });
    console.log('DESKTOP SORTING', this.taskSortForm.value);
    this.filterTaskTable();
  }

  public onMobileSort() {
    console.log('MOBILE SORTING', this.taskSortForm.value);
    this.filterTaskTable();
  }

  private filterTaskTable() {
    const filter = {
      ...this.taskAdvancedSearchForm.value,
      ...this.taskSortForm.value,
    };
    this.initializeTaskTable(filter);
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.taskAdvancedSearch);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.taskSortMenu);
    this.modalService.openModal();
  }
}
