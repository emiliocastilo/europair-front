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
import { TasksService } from '../tasks/services/tasks.service';
import { RolesService } from '../roles/services/roles.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../tasks/models/task';
import { Role } from '../roles/models/role';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';

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
  public userRoleColumnsHeader: ColumnHeaderModel[] = [];
  public userRoleColumnsData: RowDataModel[] = [];
  public userTaskColumnsHeader: ColumnHeaderModel[] = [];
  public userTaskColumnsData: RowDataModel[] = [];
  public usersSelectedCount = 0;
  public users: User[];
  public roles: Role[];
  public tasks: Task[];
  public userDetailTitle: string;
  public userSelected: User = EMPTY_USER;
  public pageTitle = 'Usuarios';
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo usuario' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];

  public userForm = this.fb.group({
    username: ['', Validators.required],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    timeZone: ['', Validators.required],
  });

  private mockUsers: User[] = [];
  private idMockUser: number = 1;

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
    // this.usersService.getUsers().subscribe(this.getUserTableData);
    this.getUserTableData(this.mockUsers);
  }

  private initializeTablesColumnsHeader() {
    this.userColumnsHeader = this.usersTableAdapterService.getUserColumnsHeader();
    this.userRoleColumnsHeader = this.usersTableAdapterService.getUserRoleColumnsHeader();
    this.userTaskColumnsHeader = this.usersTableAdapterService.getUserTaskColumnsHeader();
  }

  private getUserTableData = (users: User[]) => {
    this.users = users;
    this.userColumnsData = this.usersTableAdapterService.getUserTableDataFromUsers(
      users
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
    console.log('USUARIO ELIMINADO', this.userSelected);
    this.mockUsers = this.mockUsers.filter(
      (mockUser: User) => mockUser.id !== this.userSelected.id
    );
    this.initializeUsersTable();
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
    this.userTaskColumnsData = this.getUserTaskTableDataForUser(
      userSelected,
      data.tasks.content,
      editable
    );
    this.userDetailTitle = userDetailTitle;
    this.initializeModal(this.userDetailModal);
    this.modalService.openModal();
  };

  public onUserAction(action: { actionId: string; selectedItem: number }) {
    console.log('onUserAction', action);
    this.userSelected = { ...this.users[action.selectedItem] };
    this.userTableActions[action.actionId](action.selectedItem);
  }

  private updateUserForm(selectedUser: User) {
    this.userForm.setValue({
      username: selectedUser.username,
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
    if (newUser.id) {
      this.mockUsers = this.mockUsers.map((mockUser: User) => {
        return mockUser.id !== newUser.id ? mockUser : { ...newUser };
      });
    } else {
      this.mockUsers = [...this.mockUsers, { ...newUser, id: this.idMockUser }];
      console.log(this.mockUsers);
      this.idMockUser++;
    }
    this.initializeUsersTable();
  }
}
