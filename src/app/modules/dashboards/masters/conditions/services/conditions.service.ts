import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { Condition } from '../models/conditions';

@Injectable({
  providedIn: 'root',
})
export class ConditionsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}conditions`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
  } as const;

  
  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getConditions(searchFilter: SearchFilter = {}): Observable<Page<Condition>> {
    const url: string = this.mocked ? '/assets/mocks/conditions.json' : this.url;
    return this.http.get<Page<Condition>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getConditionById(conditionId: number): Observable<Condition> {
    return this.http.get<Condition>(`${this.url}/${conditionId}`);
  }

  public saveCondition(user: Condition): Observable<Condition> {
    return user.id !== null ? this.updateCondition(user) : this.createCondition(user);
  }

  private createCondition(user: Condition): Observable<Condition> {
    return this.http.post<Condition>(this.url, user);
  }

  private updateCondition(user: Condition): Observable<Condition> {
    const updateConditionUrl = `${this.url}/${user.id}`;
    return this.http.put<Condition>(updateConditionUrl, user);
  }

  public removeCondition(user: Condition) {
    const removeConditionUrl = `${this.url}/${user.id}`;
    return this.http.delete(removeConditionUrl);
  }
}
