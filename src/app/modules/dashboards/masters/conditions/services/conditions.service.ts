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
  private readonly url = `${environment.apiUrl}contract-conditions`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS
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

  public saveCondition(condition: Condition): Observable<Condition> {
    return condition.id ? this.updateCondition(condition) : this.createCondition(condition);
  }

  private createCondition(condition: Condition): Observable<Condition> {
    return this.http.post<Condition>(this.url, condition);
  }

  private updateCondition(condition: Condition): Observable<Condition> {
    const updateConditionUrl = `${this.url}/${condition.id}`;
    return this.http.put<Condition>(updateConditionUrl, condition);
  }

  public removeCondition(condition: Condition) {
    const removeConditionUrl = `${this.url}/${condition.id}`;
    return this.http.delete(removeConditionUrl);
  }
}
