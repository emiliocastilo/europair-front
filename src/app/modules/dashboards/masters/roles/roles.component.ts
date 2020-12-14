import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BarButtonType, BarButton } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Role, EMPTY_ROLE } from './models/role';
import { Task } from '../tasks/models/task';
import { RolesTableAdapterService } from './services/roles-table-adapter.service';
import { RolesService } from './services/roles.service';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { TasksService } from '../tasks/services/tasks.service';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Observable, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [RolesTableAdapterService],
})
export class RolesComponent implements OnInit {
  @ViewChild(RoleDetailComponent, { static: true, read: ElementRef })
  public roleDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public roleColumnsHeader: ColumnHeaderModel[] = [];
  public taskColumnsHeader: ColumnHeaderModel[] = [];
  public roleColumnsData: RowDataModel[] = [];
  public taskColumnsData: RowDataModel[] = [];
  public roleDetailTaskColumnsData: RowDataModel[] = [];
  public rolePagination: PaginationModel;
  public taskPagination: PaginationModel;
  public roleDetailTaskPagination: PaginationModel;
  public rolesSelectedCount = 0;
  private roles: Role[];
  public tasks: Task[];
  public roleDetailTitle: string;
  public roleSelected: Role = EMPTY_ROLE;
  private selectedItem: number = -1;
  public barButtons: BarButton[];

  private newRole = () => {
    this.roleDetailTitle = this.translateService.instant('ROLES.CREATE');
    this.initializeRoleDetailModal(this.roleDetailTitle, { ...EMPTY_ROLE });
    this.modalService.openModal();
  };
  private barButtonActions = {
    new: this.newRole,
  };

  private editRole = (selectedItem: number) => {
    this.initializeRoleDetailModal(this.translateService.instant('ROLES.EDIT_ROL'), {
      ...this.roles[selectedItem],
    });
    this.modalService.openModal();
  };
  private deleteRole = (selectedItem: number) => {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };
  private roleTableActions = {
    edit: this.editRole,
    delete: this.deleteRole,
  };
  constructor(
    private modalService: ModalService,
    private taskService: TasksService,
    private rolesService: RolesService,
    private rolesTableAdapterService: RolesTableAdapterService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeTablesPagination();
    this.initializeRoleTableHeaders();
    this.initializeRoleTable();
    this.initializeTaskTableHeaders();
    this.initializeTaskTable();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newRole: this.translateService.get('ROLES.NEW'),
      deleteRole: this.translateService.get('ROLES.DELETE')
    }).subscribe((data: { newRole: string, deleteRole: string }) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newRole },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteRole },
      ];
    });
  }

  private initializeTablesPagination() {
    this.taskPagination = this.rolesTableAdapterService.getPagination();
    this.roleDetailTaskPagination = this.rolesTableAdapterService.getPagination();
    this.rolePagination = this.rolesTableAdapterService.getPagination();
  }

  private initializeRoleTableHeaders() {
    this.roleColumnsHeader = this.rolesTableAdapterService.getRoleColumnsHeader();
  }

  private initializeRoleTable() {
    this.rolesService.getRoles().subscribe((roles) => {
      this.roles = roles['content'];
      this.roleColumnsData = this.rolesTableAdapterService.getRoleTableDataFromRoles(
        roles['content']
      );
      this.rolePagination = {...this.rolePagination, lastPage: this.roles.length / this.rolePagination.elementsPerPage};
      if (this.selectedItem >= 0) {
        this.onRoleSelected(this.selectedItem);
      }
    });
  }

  private initializeTaskTableHeaders() {
    this.taskColumnsHeader = this.rolesTableAdapterService.getTaskColumnsHeader();
  }

  private initializeTaskTable() {
    this.taskService
      .getTasks()
      .subscribe((tasks) => {
        this.tasks = tasks['content']
      });
  }

  private initializeRoleDetailModal(
    roleDetailTitle: string,
    roleSelected: Role
  ) {
    this.roleDetailTitle = roleDetailTitle;
    this.roleSelected = roleSelected;
    this.roleDetailTaskColumnsData = this.rolesTableAdapterService.getTaskTableDataForRole(
      this.tasks,
      this.roleSelected,
      true,
      'assigned-editable-'
    );
    this.roleDetailTaskPagination = {
      ...this.roleDetailTaskPagination, 
      lastPage: this.roleDetailTaskColumnsData.length / this.roleDetailTaskPagination.elementsPerPage
    };
    this.initializeModal(this.roleDetailModal);
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onRoleSelected(selectedIndex: number) {
  }

  public onRolesSelected(selectedIndexes: number[]) {
    console.log(selectedIndexes);
    if(selectedIndexes.length !== 1) {
      this.taskColumnsData = [];
    } else {
      this.selectedItem = selectedIndexes[0];
      this.taskColumnsData = this.rolesTableAdapterService.getTasksOfRole(
        this.tasks,
        this.roles[this.selectedItem],
        false,
        'assigned-'
      );
    }
    this.taskPagination = {...this.taskPagination, lastPage: this.taskColumnsData.length / this.taskPagination.elementsPerPage};
  }

  public onRoleAction(action: { actionId: string; selectedItem: number }) {
    this.roleTableActions[action.actionId](action.selectedItem);
  }

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onConfirmDeleteRole() {
    this.rolesService
      .deleteRole(this.roles[this.selectedItem])
      .subscribe((response) => {
        console.log(response);
        this.initializeRoleTable();
        this.taskColumnsData = [];
      });
  }

  public onSaveRole(role: Role) {
    this.modalService.closeModal();
    const save: Observable<Role> = role.id ? this.rolesService.editRole(role) : this.rolesService.addRole(role);
    save.subscribe((role) => {
      console.log(role);
      this.initializeRoleTable();
    });
  }
}
