import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly url = `${environment.apiUrl}users`;
  private readonly filterOptions: FilterOptions = {
    filter_username: OperatorEnum.CONTAINS,
    filter_internalUser: OperatorEnum.EQUALS
  } as const;
  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getUsers(searchFilter: SearchFilter = {}): Observable<Page<User>> {
    return this.http.get<Page<User>>(this.url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter, this.filterOptions)
    });
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
