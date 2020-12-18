import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { ContractCondition } from '../models/contract-condition.model';

export interface ContractConditionCopy {
  contractId: number;
  conditions: Array<number>;
}

@Injectable({
  providedIn: 'root',
})
export class ContractConditionsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}contract-conditions`;
  private readonly filterOptions: FilterOptions = {
    filter_title: OperatorEnum.CONTAINS,
    'filter_contract.id': OperatorEnum.EQUALS,
    filter_contractId: OperatorEnum.IS_NULL
  } as const;


  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getAllContractConditions(searchFilter: SearchFilter = {}): Observable<Page<ContractCondition>> {
    const url: string = this.mocked ? '/assets/mocks/conditions.json' : this.url;
    return this.http.get<Page<ContractCondition>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getContractConditions(contractId: number, searchFilter: SearchFilter = {}): Observable<Page<ContractCondition>> {
    const url: string = this.mocked ? '/assets/mocks/contractConditions.json' : this.url;
    return this.http.get<Page<ContractCondition>>(url, {
      params: this.searchFilterService.createHttpParams(
        {...searchFilter, 'filter_contract.id': contractId.toString() },
        this.filterOptions
      ),
    });
  }

  public getGeneralContractConditions(searchFilter: SearchFilter = {}): Observable<Page<ContractCondition>> {
    const url: string = this.mocked ? '/assets/mocks/conditions.json' : this.url;
    return this.http.get<Page<ContractCondition>>(url, {
      params: this.searchFilterService.createHttpParams(
        {...searchFilter, filter_contractId: null },
        this.filterOptions
      )
    });
  }

  public getContractConditionById(conditionId: number): Observable<ContractCondition> {
    return this.http.get<ContractCondition>(`${this.url}/${conditionId}`);
  }

  public saveContractCondition(contractCondition: ContractCondition): Observable<ContractCondition> {
    return contractCondition.id !== null ? this.updateContractCondition(contractCondition) : this.createContractCondition(contractCondition);
  }

  public saveGeneralConditionToContract(contractId: number, contractCondition: ContractCondition) {
    return this.http.post<ContractCondition>(this.url, {...contractCondition, contractId, id: null});
  }

  private createContractCondition(contractCondition: ContractCondition): Observable<ContractCondition> {
    return this.http.post<ContractCondition>(this.url, contractCondition);
  }

  private updateContractCondition(contractCondition: ContractCondition): Observable<ContractCondition> {
    const updateContractConditionsUrl = `${this.url}/${contractCondition.id}`;
    return this.http.put<ContractCondition>(updateContractConditionsUrl, contractCondition);
  }

  public removeContractConditions(contractCondition: ContractCondition) {
    const removeContractConditionsUrl = `${this.url}/${contractCondition.id}`;
    return this.http.delete(removeContractConditionsUrl);
  }

  public addConditionsToContract(contractCondition: ContractConditionCopy): Observable<void>  {
    const url = `${this.url}/copy`;
    return this.http.post<void>(url, contractCondition);
  }
}
