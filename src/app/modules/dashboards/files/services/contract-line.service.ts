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

  constructor(
    private readonly http: HttpClient,
    private readonly searchFilterService: SearchFilterService
  ) { }

  public updateContractLine(fileId: number, contractId: number, contractLine: ContractLine): Observable<ContractLine> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/lines/${contractLine.id}`;
    return this.http.put<ContractLine>(url, contractLine);
  }

  public deleteContractLine(fileId: number, contractId: number, contractLineId: number): Observable<void> {
    const url = `${this.url}/${fileId}/contracts/${contractId}/lines/${contractLineId}`;
    return this.http.delete<void>(url);
  }


  public getTotalPrice(lines: ContractLine[]) {
    return lines.reduce(this.totalPriceReducer, 0);
  }

  private totalPriceReducer = (totalAmount: number, line: ContractLine): number =>
    (line.price ? totalAmount + line.price : totalAmount);
}
