import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';
import { Screen } from '../models/screen';
import { SearchFilter, FilterOptions } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly filterOptions: FilterOptions = { filter_name: OperatorEnum.CONTAINS } as const;

  constructor(private http: HttpClient) {}

  public getTasks(searchFilter: SearchFilter = {}): Observable<Task[]> {
    const url = environment.apiUrl + 'tasks';
    return this.http.get<Task[]>(url, {
      params: this.createHttpParams(searchFilter),
    });
  }

  private createHttpParams(searchFilter: SearchFilter): SearchFilter {
    const clonedSearchFilter = { ...searchFilter };
    Object.keys(searchFilter).forEach((key) => {
      if (clonedSearchFilter[key] === '') {
        delete clonedSearchFilter[key];
      } else {
        this.addFilterOptions(key, clonedSearchFilter);
      }
    });
    return clonedSearchFilter;
  }

  public addFilterOptions(key: string, searchFilter: SearchFilter): void {
    if(this.filterOptions[key] !== undefined) {
      searchFilter[key] = `${searchFilter[key]},${this.filterOptions[key]}`;
    }
  }

  public getScreens(searchFilter: SearchFilter = {}): Observable<Screen[]> {
    const url = environment.apiUrl + 'screens';
    return this.http.get<Screen[]>(url, {
      params: this.createHttpParams(searchFilter),
    });
  }

  public addTask(task: Task): Observable<Task> {
    const url = environment.apiUrl + 'tasks';
    return this.http.post<Task>(url, task);
  }

  public editTask(task: Task): Observable<Task> {
    const url = environment.apiUrl + 'tasks';
    return this.http.put<Task>(`${url}/${task.id}`, task);
  }

  public deleteTask(task: Task): Observable<any> {
    const url = environment.apiUrl + 'tasks';
    return this.http.delete<Task>(url + '/' + task.id);
  }
}
