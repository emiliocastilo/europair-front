import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Contract } from '../models/Contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private readonly url = `${environment.apiUrl}`;
  private readonly filterOptions: FilterOptions = {
    filter_code: OperatorEnum.CONTAINS,
    filter_statusId: OperatorEnum.EQUALS,
    'filter_status.code': OperatorEnum.EQUALS,
    filter_clientId: OperatorEnum.EQUALS
  } as const;

  constructor(
    private readonly http: HttpClient,
    private readonly searchFilterService: SearchFilterService
  ) {}

  public searchContract(fileId: number, searchFilter: SearchFilter = {}): Observable<Page<Contract>> {
    const params: SearchFilter = {
      ...this.searchFilterService.createHttpParams(searchFilter, this.filterOptions),
      fileId: fileId.toString()
    };
    return this.http.get<Page<Contract>>(`${this.url}files/${fileId}/contracts`, { params });
  }

  public getContract(fileId: number, contractId: number): Observable<Contract> {
    const url = `${this.url}files/${fileId}/contracts/${contractId}`;
    return this.http.get<Contract>(url);
  }

  public generateContract(fileId: number, routeIds: Array<number>): Observable<void> {
    return this.http.post<void>(`${this.url}files/${fileId}/contracts/generate`, routeIds);
  }

  public createContract(fileId: number, contract: Contract): Observable<void> {
    return this.http.post<void>(`${this.url}files/${fileId}/contracts`, contract);
  }

  public updateContract(fileId: number, contract: Contract): Observable<Contract> {
    const url = `${this.url}files/${fileId}/contracts/${contract.id}`;
    return this.http.put<Contract>(url, contract);
  }

  public deleteContract(fileId: number, contractId: number): Observable<void> {
    const url = `${this.url}files/${fileId}/contracts/${contractId}`;
    return this.http.delete<void>(url);
  }
}
