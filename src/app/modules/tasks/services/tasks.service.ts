import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';
import { Screen } from '../models/screen';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _mockTasks: Task[] = [
    {
      id: 1,
      name: 'Gestión de expedientes',
      description: '',
      screens: [
        {
          id: 6,
          name: 'Expedientes',
          description: '',
        },
        {
          id: 7,
          name: 'Cotizaciones',
          description: '',
        },
      ],
    },
    {
      id: 2,
      name: 'Gestión contactos',
      description: '',
      screens: [
        {
          id: 2,
          name: 'Aeropuertos',
          description: '',
        },
        {
          id: 4,
          name: 'Franjas horarias',
          description: '',
        },
      ],
    },
    {
      id: 3,
      name: 'Configuración de usuarios',
      description: '',
      screens: [
        {
          id: 1,
          name: 'Usuarios',
          description: '',
        },
        {
          id: 8,
          name: 'Configuracion',
          description: '',
        },
      ],
    },
    {
      id: 4,
      name: 'Configuración de la herramienta',
      description: '',
      screens: [
        {
          id: 8,
          name: 'Configuracion',
          description: '',
        },
      ],
    },
    {
      id: 5,
      name: 'Creación de cotizaciones',
      description: '',
      screens: [
        {
          id: 5,
          name: 'Tipos de impuesto',
          description: '',
        },
        {
          id: 6,
          name: 'Expedientes',
          description: '',
        },
        {
          id: 7,
          name: 'Cotizaciones',
          description: '',
        },
      ],
    },
    {
      id: 6,
      name: 'Envío de facturas',
      description: '',
      screens: [
        {
          id: 5,
          name: 'Tipos de impuesto',
          description: '',
        },
        {
          id: 6,
          name: 'Expedientes',
          description: '',
        },
        {
          id: 7,
          name: 'Cotizaciones',
          description: '',
        },
      ],
    },
    {
      id: 7,
      name: 'Seguimiento de vuelos',
      description: '',
      screens: [
        {
          id: 2,
          name: 'Aeropuertos',
          description: '',
        },
        {
          id: 3,
          name: 'Flota',
          description: '',
        },
        {
          id: 4,
          name: 'Franjas horarias',
          description: '',
        },
      ],
    },
    {
      id: 8,
      name: 'Recálculo de tasas',
      description: '',
      screens: [
        {
          id: 4,
          name: 'Franjas horarias',
          description: '',
        },
        {
          id: 5,
          name: 'Tipos de impuesto',
          description: '',
        },
        {
          id: 6,
          name: 'Expedientes',
          description: '',
        },
        {
          id: 7,
          name: 'Cotizaciones',
          description: '',
        },
      ],
    },
  ];
  private _mockScreens: Screen[] = [
    {
      id: 1,
      name: 'Usuarios',
      description: '',
    },
    {
      id: 2,
      name: 'Aeropuertos',
      description: '',
    },
    {
      id: 3,
      name: 'Flota',
      description: '',
    },
    {
      id: 4,
      name: 'Franjas horarias',
      description: '',
    },
    {
      id: 5,
      name: 'Tipos de impuesto',
      description: '',
    },
    {
      id: 6,
      name: 'Expedientes',
      description: '',
    },
    {
      id: 7,
      name: 'Cotizaciones',
      description: '',
    },
    {
      id: 8,
      name: 'Configuracion',
      description: '',
    },
  ];

  private currentTaskId = 9;

  constructor(private http: HttpClient) {}

  public getTasks(): Observable<Task[]> {
    const url = environment.apiUrl + 'tasks';
    return this.http.get<Task[]>(url);
  }

  public getScreens(): Observable<Screen[]> {
    const url = environment.apiUrl + 'screens';
    return this.http.get<Screen[]>(url);
  }

  public saveTask(task: Task):Observable<Task> {
    const url = environment.apiUrl + 'tasks';
    return this.http.post<Task>(url, task);
  }

  public deleteTask(task:Task):Observable<any>{
    const url = environment.apiUrl + 'tasks';
    return this.http.delete<Task>(url+ '/' + task.id);
  }

  public getMockTasks(): Task[] {
    return this._mockTasks;
  }

  public getMockScreens(): Screen[] {
    return this._mockScreens;
  }

  public saveMockTask(task: Task): void {
    return task.id ? this.putMockTask(task) : this.postMockTask(task);
  }

  private putMockTask(modifiedTask: Task): void {
    this._mockTasks = this._mockTasks.map((task) =>
      this.modifyTask(task, modifiedTask)
    );
  }

  private modifyTask(oldTask: Task, newTask: Task): Task {
    return oldTask.id === newTask.id ? newTask : oldTask;
  }

  private postMockTask(task: Task): void {
    task = { ...task, id: this.currentTaskId };
    this._mockTasks = [...this._mockTasks, task];
    this.currentTaskId++;
  }

  public deleteMockTask(taskToRemove: Task): void {
    this._mockTasks = this._mockTasks.filter(
      (task) => task.id !== taskToRemove.id
    );
  }
}
