import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly url = `${environment.apiUrl}users`;
  constructor(private http: HttpClient) {}

  public getUsers(): Observable<Page<User>> {
    return this.http.get<Page<User>>(this.url);
  }

  public saveUser(user: User): Observable<User> {
    return user.id !== null ? this.updateUser(user) : this.createUser(user);
  }

  private createUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  private updateUser(user: User): Observable<User> {
    const updateUserUrl = `${this.url}/${user.id}`;
    return this.http.put<User>(updateUserUrl, user);
  }

  public removeUser(user: User) {
    const removeUserUrl = `${this.url}/${user.id}`;
    return this.http.delete(removeUserUrl);
  }
}
