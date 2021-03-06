import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { CancellationFees } from '../models/cancellation-fees.model';

@Injectable({
  providedIn: 'root',
})
export class CancellationFeesService {
  private readonly url = `${environment.apiUrl}contract-cancel-fee`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
    'filter_contract.id': OperatorEnum.EQUALS
  } as const;

  
  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getCancellationFees(searchFilter: SearchFilter = {}): Observable<Page<CancellationFees>> {
    const url: string = environment.mock ? '/assets/mocks/cancellation-fees.json' : this.url;
    return this.http.get<Page<CancellationFees>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getCancellationFeesById(cancellationFeesId: number): Observable<CancellationFees> {
    return this.http.get<CancellationFees>(`${this.url}/${cancellationFeesId}`);
  }

  public saveCancellationFees(cancellationFees: CancellationFees): Observable<CancellationFees> {
    return cancellationFees.id !== null ? this.updateCancellationFees(cancellationFees) : this.createCancellationFees(cancellationFees);
  }

  private createCancellationFees(cancellationFees: CancellationFees): Observable<CancellationFees> {
    return this.http.post<CancellationFees>(this.url, cancellationFees);
  }

  private updateCancellationFees(cancellationFees: CancellationFees): Observable<CancellationFees> {
    const updateCancellationFeesUrl = `${this.url}/${cancellationFees.id}`;
    return this.http.put<CancellationFees>(updateCancellationFeesUrl, cancellationFees);
  }

  public removeCancellationFees(cancellationFees: CancellationFees) {
    const removeCancellationFeesUrl = `${this.url}/${cancellationFees.id}`;
    return this.http.delete(removeCancellationFeesUrl);
  }
}
