import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { ContractCondition } from '../models/contract-condition.model';
import { ContractConfiguration } from '../models/contract-configuration.model';

@Injectable({
  providedIn: 'root',
})
export class ContractConfigurationService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}files`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
    'filter_contract.id': OperatorEnum.EQUALS
  } as const;


  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getContractConfiguration(fileId: number, contractId: number, searchFilter: SearchFilter = {}): Observable<Page<ContractCondition>> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/configuration`;
    return this.http.get<Page<ContractCondition>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public saveContractConfiguration(fileId: number, contractId: number, contractConfiguration: ContractConfiguration): Observable<ContractCondition> {
    return (contractConfiguration.id) ?
    this.updateContractConfiguration(fileId, contractId, contractConfiguration) :
     this.createContractConfiguration(fileId, contractId, contractConfiguration);
  }

  private createContractConfiguration(fileId: number, contractId: number, contractConfiguration: ContractConfiguration): Observable<ContractCondition> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/configuration`;
    return this.http.post<ContractCondition>(url, contractConfiguration);
  }

  private updateContractConfiguration(fileId: number, contractId: number, contractConfiguration: ContractConfiguration): Observable<ContractConfiguration> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/configuration/${contractConfiguration.id}`;
    return this.http.put<ContractConfiguration>(url, contractConfiguration);
  }

  public deleteContractConfiguration(fileId: number, contractId: number, contractConfigurationId: number): Observable<void> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/configuration/${contractConfigurationId}`;
    return this.http.delete<void>(url);
  }

}
