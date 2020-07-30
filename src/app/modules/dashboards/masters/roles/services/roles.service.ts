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
  constructor(private httpClient: HttpClient) {}

  public getRoles(): Observable<Role[]> {
    const url = environment.apiUrl + 'roles';
    return this.httpClient.get<Role[]>(url);
  }

  public addRole(role: Role): Observable<Role> {
    const url = environment.apiUrl + 'roles';
    return this.httpClient.post<Role>(url, role);
  }

  public editRole(role: Role): Observable<Role> {
    const url = environment.apiUrl + 'roles';
    return this.httpClient.put<Role>(`${url}/${role.id}`, role);
  }

  public deleteRole(role: Role): Observable<any> {
    const url = environment.apiUrl + 'roles';
    return this.httpClient.delete<Role>(url + '/' + role.id);
  }
}
