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

  public saveContractConditions(contractCondition: ContractCondition): Observable<ContractCondition> {
    return contractCondition.id !== null ? this.updateContractConditions(contractCondition) : this.createContractConditions(contractCondition);
  }

  private createContractConditions(contractCondition: ContractCondition): Observable<ContractCondition> {
    return this.http.post<ContractCondition>(this.url, contractCondition);
  }

  private updateContractConditions(contractCondition: ContractCondition): Observable<ContractCondition> {
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
