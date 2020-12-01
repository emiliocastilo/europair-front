import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { ContractLine } from '../models/Contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractLineService {
  private readonly url = `${environment.apiUrl}files`;
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

  public searchContractLine(fileId: number, searchFilter: SearchFilter = {}): Observable<Page<ContractLine>> {
    const url = `${this.url}/${fileId}/contractLine`;
    return this.http.get<Page<ContractLine>>(url, { params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions)});
  }

  public getContractLine(fileId: number, contractLineId: number): Observable<ContractLine> {
    const url = `${this.url}/${fileId}/contractLine/${contractLineId}`;
    return this.http.get<ContractLine>(url);
  }

  public createContractLine(fileId: number, contractLine: ContractLine): Observable<void> {
    const url = `${this.url}/${fileId}/contractLine`;
    return this.http.post<void>(url, contractLine);
  }

  public updateContractLine(fileId: number, contractLine: ContractLine): Observable<ContractLine> {
    const url = `${this.url}/${fileId}/contractLine/${contractLine.id}`;
    return this.http.put<ContractLine>(url, contractLine);
  }

  public deleteContractLine(fileId: number, contractLineId: number): Observable<void> {
    const url = `${this.url}/${fileId}/contractLine/${contractLineId}`;
    return this.http.delete<void>(url);
  }

  
  public getTotalPrice(lines: ContractLine[]) {
    return lines.reduce(this.totalPriceReducer, 0);
  }

  private totalPriceReducer = (totalAmount: number, line: ContractLine): number =>
   (line.price ? totalAmount + line.price : totalAmount);
}
