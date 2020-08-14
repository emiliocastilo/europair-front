import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { User, EMPTY_USER } from './models/user';
import {
  BarButtonType,
  BarButton,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { UsersService } from './services/users.service';
import { UsersTableAdapterService } from './services/users-table-adapter.service';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { Role } from '../roles/models/role';
import { Task } from '../tasks/models/task';
import { TasksService } from '../tasks/services/tasks.service';
import { RolesService } from '../roles/services/roles.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersTableAdapterService],
})
export class UsersComponent implements OnInit {
  @ViewChild(UserDetailComponent, { static: true, read: ElementRef })
  public userDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  private readonly VIEW_USER_TITLE = 'Detalle usuario';
  private readonly EDIT_USER_TITLE = 'Editar usuario';
  private readonly CREATE_USER_TITLE = 'Crear usuario';

  public userColumnsHeader: ColumnHeaderModel[] = [];
  public userColumnsData: RowDataModel[] = [];
  public userColumnsPagination: PaginationModel;
  public userRoleColumnsHeader: ColumnHeaderModel[] = [];
  public userRoleColumnsData: RowDataModel[] = [];
  public userRoleColumnsPagination: PaginationModel;
  public userTaskColumnsHeader: ColumnHeaderModel[] = [];
  public userTaskColumnsData: RowDataModel[] = [];
  public userTaskColumnsPagination: PaginationModel;
  public usersSelectedCount = 0;
  public users: User[];
  public roles: Role[];
  public tasks: Task[];
  public userDetailTitle: string;
  public userSelected: User = EMPTY_USER;
  public pageTitle = 'Usuarios';
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo usuario' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];

  public userForm = this.fb.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    password: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    timeZone: ['', Validators.required],
  });

  constructor(
    private modalService: ModalService,
    private usersService: UsersService,
    private usersTableAdapterService: UsersTableAdapterService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.initializeUsersTable();
    this.initializeTablesColumnsHeader();
  }

  private initializeUsersTable() {
    this.usersService.getUsers().subscribe(this.getUserTableData);
  }

  private initializeTablesColumnsHeader() {
    this.userColumnsHeader = this.usersTableAdapterService.getUserColumnsHeader();
    this.userRoleColumnsHeader = this.usersTableAdapterService.getUserRoleColumnsHeader();
    this.userTaskColumnsHeader = this.usersTableAdapterService.getUserTaskColumnsHeader();
  }

  private getUserTableData = (users: Page<User>) => {
    this.users = users.content;
    this.userColumnsData = this.usersTableAdapterService.getUserTableDataFromUsers(
      users.content
    );
    this.userColumnsPagination = this.initializeClientTablePagination(
      this.userColumnsData
    );
  };

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private newUser = () => {
    this.getTasksAndRoles$().subscribe(this.getNewUserDetailData);
  };

  private getNewUserDetailData = (data: any) => {
    this.userSelected = { ...EMPTY_USER };
    this.userForm.enable();
    this.userForm.reset();
    this.getUserDetailData(data, this.CREATE_USER_TITLE, EMPTY_USER);
  };

  private barButtonActions = {
    new: this.newUser,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onUserSelected(selectedIndex: number) {}

  private viewUser = (selectedItem: number) => {
    this.getTasksAndRoles$().subscribe(this.getViewUserDetailData);
  };

  private getViewUserDetailData = (data: any) => {
    this.updateUserForm(this.userSelected);
    this.userForm.disable();
    this.getUserDetailData(
      data,
      this.VIEW_USER_TITLE,
      this.userSelected,
      false
    );
  };

  private editUser = (selectedItem: number) => {
    this.getTasksAndRoles$().subscribe(this.getEditUserDetailData);
  };

  private getEditUserDetailData = (data: any) => {
    this.updateUserForm(this.userSelected);
    this.userForm.enable();
    this.getUserDetailData(data, this.EDIT_USER_TITLE, this.userSelected);
  };

  private deleteUser = (selectedItem: number) => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  public onConfirmDeleteUser() {
    this.usersService
      .removeUser(this.userSelected)
      .subscribe((_) => this.initializeUsersTable());
  }

  private userTableActions = {
    view: this.viewUser,
    edit: this.editUser,
    delete: this.deleteUser,
  };

  private getUserDetailData = (
    data: any,
    userDetailTitle: string,
    userSelected: User,
    editable = true
  ) => {
    this.userRoleColumnsData = this.getUserRoleTableDataForUser(
      userSelected,
      data.roles.content,
      editable
    );
    this.userRoleColumnsPagination = this.initializeClientTablePagination(
      this.userRoleColumnsData
    );
    this.userTaskColumnsData = this.getUserTaskTableDataForUser(
      userSelected,
      data.tasks.content,
      editable
    );
    this.userTaskColumnsPagination = this.initializeClientTablePagination(
      this.userTaskColumnsData
    );
    this.userDetailTitle = userDetailTitle;
    this.initializeModal(this.userDetailModal);
    this.modalService.openModal();
  };

  public onUserAction(action: { actionId: string; selectedItem: number }) {
    this.userSelected = { ...this.users[action.selectedItem] };
    this.userTableActions[action.actionId](action.selectedItem);
  }

  private updateUserForm(selectedUser: User) {
    this.userForm.setValue({
      username: selectedUser.username,
      password: selectedUser.password,
      name: selectedUser.name,
      surname: selectedUser.surname,
      email: selectedUser.email,
      timeZone: selectedUser.timeZone,
    });
  }

  private getUserRoleTableDataForUser(
    user: User,
    roles: Role[] = [],
    editable = true
  ): RowDataModel[] {
    const userRoles = user ? user.roles : [];
    return this.usersTableAdapterService.getUserRoleTableData(
      roles,
      userRoles,
      'assigned-role-',
      editable
    );
  }

  private getUserTaskTableDataForUser(
    user: User,
    tasks: Task[] = [],
    editable = true
  ): RowDataModel[] {
    const userTasks = user ? user.tasks : [];
    return this.usersTableAdapterService.getUserTaskTableData(
      tasks,
      userTasks,
      'assigned-task-',
      editable
    );
  }

  private getTasksAndRoles$() {
    return forkJoin({
      tasks: this.tasksService.getTasks(),
      roles: this.rolesService.getRoles(),
    }).pipe(
      tap((data: any) => {
        this.roles = data.roles.content;
        this.tasks = data.tasks.content;
      })
    );
  }

  public onSaveUser(newUser: User) {
    this.usersService
      .saveUser(newUser)
      .subscribe(() => this.initializeUsersTable());
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.usersTableAdapterService.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }
}
