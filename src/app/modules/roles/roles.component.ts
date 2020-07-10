import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButtonType,
  BarButton,
} from 'src/app/core/models/menus/button-bar/bar-button';
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
  public pageTitle = 'Roles';
  public rolesSelectedCount = 0;
  private roles: Role[];
  public tasks: Task[];
  public roleDetailTitle: string;
  public roleSelected: Role = EMPTY_ROLE;
  private selectedItem: number = -1;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo rol' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];

  private readonly EDIT_TASK_TITLE = 'Editar rol';
  private readonly CREATE_TASK_TITLE = 'Crear rol';

  private newRole = () => {
    this.roleDetailTitle = this.CREATE_TASK_TITLE;
    this.initializeRoleDetailModal(this.CREATE_TASK_TITLE, { ...EMPTY_ROLE });
    this.modalService.openModal();
  };
  private barButtonActions = {
    new: this.newRole,
  };

  private editRole = (selectedItem: number) => {
    this.initializeRoleDetailModal(this.EDIT_TASK_TITLE, {
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
    private rolesTableAdapterService: RolesTableAdapterService
  ) {}

  ngOnInit(): void {
    this.initializeRoleTable();
    this.initializeTaskTable();
  }

  private initializeRoleTable() {
    this.roleColumnsHeader = this.rolesTableAdapterService.getRoleColumnsHeader();
    this.rolesService.getRoles().subscribe((roles) => {
      this.roles = roles['content'];
      this.roleColumnsData = this.rolesTableAdapterService.getRoleTableDataFromRoles(
        roles['content']
      );
      if (this.selectedItem >= 0) {
        this.onRoleSelected(this.selectedItem);
      }
    });
  }

  private initializeTaskTable() {
    this.taskColumnsHeader = this.rolesTableAdapterService.getTaskColumnsHeader();
    this.taskService
      .getTasks()
      .subscribe((tasks) => (this.tasks = tasks['content']));
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
    this.initializeModal(this.roleDetailModal);
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onRoleSelected(selectedIndex: number) {
    this.selectedItem = selectedIndex;
    this.taskColumnsData = this.rolesTableAdapterService.getTaskTableDataForRole(
      this.tasks,
      this.roles[selectedIndex],
      false,
      'assigned-'
    );
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
    this.rolesService.saveRole(role).subscribe((role) => {
      console.log(role);
      this.initializeRoleTable();
    });
  }
}
