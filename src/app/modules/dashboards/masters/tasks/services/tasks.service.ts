import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';
import { Screen } from '../models/screen';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  public getTasks(searchFilter: SearchFilter = {}): Observable<Task[]> {
    const url = environment.apiUrl + 'tasks';
    return this.http.get<Task[]>(url, {
      params: this.filterEmptyString(searchFilter),
    });
  }

  private filterEmptyString(searchFilter: SearchFilter): SearchFilter {
    const clonedSearchFilter = { ...searchFilter };
    Object.keys(searchFilter).forEach((key) => {
      if (searchFilter[key] === '') {
        delete clonedSearchFilter[key];
      }
    });
    return clonedSearchFilter;
  }

  public getScreens(): Observable<Screen[]> {
    const url = environment.apiUrl + 'screens';
    return this.http.get<Screen[]>(url + '?size=2000');
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
