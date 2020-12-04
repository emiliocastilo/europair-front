import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { ContractCondition } from '../models/contract-condition.model';

@Injectable({
  providedIn: 'root',
})
export class ContractConditionsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}contract-conditions`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
    'filter_contract.id': OperatorEnum.EQUALS
  } as const;


  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getContractConditions(searchFilter: SearchFilter = {}): Observable<Page<ContractCondition>> {
    const url: string = this.mocked ? '/assets/mocks/contractConditions.json' : this.url;
    return this.http.get<Page<ContractCondition>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getContractConditionById(contractConditionsId: number): Observable<ContractCondition> {
    return this.http.get<ContractCondition>(`${this.url}/${contractConditionsId}`);
  }

  public saveContractConditions(user: ContractCondition): Observable<ContractCondition> {
    return user.id !== null ? this.updateContractConditions(user) : this.createContractConditions(user);
  }

  private createContractConditions(user: ContractCondition): Observable<ContractCondition> {
    return this.http.post<ContractCondition>(this.url, user);
  }

  private updateContractConditions(user: ContractCondition): Observable<ContractCondition> {
    const updateContractConditionsUrl = `${this.url}/${user.id}`;
    return this.http.put<ContractCondition>(updateContractConditionsUrl, user);
  }

  public removeContractConditions(user: ContractCondition) {
    const removeContractConditionsUrl = `${this.url}/${user.id}`;
    return this.http.delete(removeContractConditionsUrl);
  }
}
