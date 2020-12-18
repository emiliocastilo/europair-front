import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { ContractPaymentCondition } from '../models/contract-payment-condition';

@Injectable({
  providedIn: 'root'
})
export class ContractPaymentConditionService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}contract-payment-conditions`;
  private readonly filterOptions: FilterOptions = {
    filter_code: OperatorEnum.CONTAINS,
    filter_name: OperatorEnum.CONTAINS,
  } as const;


  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getContractPaymentConditions(searchFilter: SearchFilter = {}): Observable<Page<ContractPaymentCondition>> {
    return this.http.get<Page<ContractPaymentCondition>>(this.url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getContractPaymentConditionById(contractPaymentConditionId: number): Observable<Page<ContractPaymentCondition>> {
    const url = `${this.url}/${contractPaymentConditionId}`;
    return this.http.get<Page<ContractPaymentCondition>>(url);
  }

  public saveContractPaymentCondition(contractPaymentCondition: ContractPaymentCondition): Observable<ContractPaymentCondition> {
    return (contractPaymentCondition.id) ?
    this.updateContractPaymentCondition(contractPaymentCondition) :
     this.createContractPaymentCondition(contractPaymentCondition);
  }

  private createContractPaymentCondition(contractPaymentCondition: ContractPaymentCondition): Observable<ContractPaymentCondition> {
    return this.http.post<ContractPaymentCondition>(this.url, contractPaymentCondition);
  }

  private updateContractPaymentCondition(contractPaymentCondition: ContractPaymentCondition): Observable<ContractPaymentCondition> {
    const url = `${this.url}/${contractPaymentCondition.id}`;
    return this.http.put<ContractPaymentCondition>(url, contractPaymentCondition);
  }

  public deleteContractPaymentCondition(contractPaymentCondition: ContractPaymentCondition): Observable<void> {
    const url = `${this.url}/${contractPaymentCondition.id}`;
    return this.http.delete<void>(url);
  }
}
