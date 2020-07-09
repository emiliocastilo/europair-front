import { Injectable } from '@angular/core';
import { Task } from '../../tasks/models/task';
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private _mockRoles: Role[] = [
    {
      id: 1,
      name: 'Administrador',
      description: '',
      tasks: [
        {
          id: 1,
          name: 'Gestión de expedientes',
          description: '',
          screens: [],
        },
        {
          id: 2,
          name: 'Gestión contactos',
          description: '',
          screens: [],
        },
        {
          id: 3,
          name: 'Configuración de usuarios',
          description: '',
          screens: [],
        },
        {
          id: 4,
          name: 'Configuración de la herramienta',
          description: '',
          screens: [],
        },
        {
          id: 5,
          name: 'Creación de cotizaciones',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 2,
      name: 'Gerencia',
      description: '',
      tasks: [
        {
          id: 1,
          name: 'Gestión de expedientes',
          description: '',
          screens: [],
        },
        {
          id: 2,
          name: 'Gestión contactos',
          description: '',
          screens: [],
        },
        {
          id: 3,
          name: 'Configuración de usuarios',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 3,
      name: 'IT',
      description: '',
      tasks: [
        {
          id: 5,
          name: 'Creación de cotizaciones',
          description: '',
          screens: [],
        },
        {
          id: 6,
          name: 'Envío de facturas',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 4,
      name: 'Director comercial',
      description: '',
      tasks: [
        {
          id: 6,
          name: 'Envío de facturas',
          description: '',
          screens: [],
        },
        {
          id: 7,
          name: 'Seguimiento de vuelos',
          description: '',
          screens: [],
        },
        {
          id: 8,
          name: 'Recálculo de tasas',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 5,
      name: 'Comercial',
      description: '',
      tasks: [
        {
          id: 6,
          name: 'Envío de facturas',
          description: '',
          screens: [],
        },
        {
          id: 8,
          name: 'Recálculo de tasas',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 6,
      name: 'Director operaciones',
      description: '',
      tasks: [
        {
          id: 1,
          name: 'Gestión de expedientes',
          description: '',
          screens: [],
        },
        {
          id: 2,
          name: 'Gestión contactos',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 7,
      name: 'Operaciones',
      description: '',
      tasks: [
        {
          id: 1,
          name: 'Gestión de expedientes',
          description: '',
          screens: [],
        },
      ],
    },
    {
      id: 8,
      name: 'Guardias',
      description: '',
      tasks: [
        {
          id: 7,
          name: 'Seguimiento de vuelos',
          description: '',
          screens: [],
        },
      ],
    },
  ];
  private _mockTasks: Task[] = [
    {
      id: 1,
      name: 'Gestión de expedientes',
      description: '',
      screens: [],
    },
    {
      id: 2,
      name: 'Gestión contactos',
      description: '',
      screens: [],
    },
    {
      id: 3,
      name: 'Configuración de usuarios',
      description: '',
      screens: [],
    },
    {
      id: 4,
      name: 'Configuración de la herramienta',
      description: '',
      screens: [],
    },
    {
      id: 5,
      name: 'Creación de cotizaciones',
      description: '',
      screens: [],
    },
    {
      id: 6,
      name: 'Envío de facturas',
      description: '',
      screens: [],
    },
    {
      id: 7,
      name: 'Seguimiento de vuelos',
      description: '',
      screens: [],
    },
    {
      id: 8,
      name: 'Recálculo de tasas',
      description: '',
      screens: [],
    },
  ];

  private currentRoleId = 9;

  constructor(private httpClient:HttpClient) {}

  public getRoles():Observable<Role[]>{
    const url = environment.apiUrl + 'roles';
    return this.httpClient.get<Role[]>(url);
  }

  public saveRole(role:Role):Observable<Role>{
    const url = environment.apiUrl + 'roles';
    return this.httpClient.post<Role>(url, role);
  }

  public getMockTasks(): Task[] {
    return this._mockTasks;
  }

  public getMockRoles(): Role[] {
    return this._mockRoles;
  }

  public saveMockRole(role: Role): void {
    return role.id ? this.putMockRole(role) : this.postMockRole(role);
  }

  private putMockRole(modifiedRole: Role): void {
    this._mockRoles = this._mockRoles.map((role) =>
      this.modifyRole(role, modifiedRole)
    );
  }

  private modifyRole(oldRole: Role, newRole: Role): Role {
    return oldRole.id === newRole.id ? newRole : oldRole;
  }

  private postMockRole(role: Role): void {
    role = { ...role, id: this.currentRoleId };
    this._mockRoles = [...this._mockRoles, role];
    this.currentRoleId++;
  }

  public deleteMockRole(roleToRemove: Role): void {
    this._mockRoles = this._mockRoles.filter(
      (role) => role.id !== roleToRemove.id
    );
  }
}
