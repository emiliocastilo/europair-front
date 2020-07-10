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
  constructor(private http: HttpClient) {}

  public getTasks(): Observable<Task[]> {
    const url = environment.apiUrl + 'tasks';
    return this.http.get<Task[]>(url);
  }

  public getScreens(): Observable<Screen[]> {
    const url = environment.apiUrl + 'screens';
    return this.http.get<Screen[]>(url);
  }

  public saveTask(task: Task): Observable<Task> {
    const url = environment.apiUrl + 'tasks';
    return this.http.post<Task>(url, task);
  }

  public deleteTask(task: Task): Observable<any> {
    const url = environment.apiUrl + 'tasks';
    return this.http.delete<Task>(url + '/' + task.id);
  }
}
