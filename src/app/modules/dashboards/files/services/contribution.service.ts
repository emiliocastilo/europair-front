import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Contribution } from '../components/search-aircraft/models/contribution.model';

@Injectable({
  providedIn: 'root',
})

export class ContributionService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}files/`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getContributions(fileId: number, routeId: number, searchFilter: SearchFilter = {}): Observable<Page<Contribution>> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}${fileId}/routes/${routeId}/contributions`;
    return this.http.get<Page<Contribution>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public createContribution(fileId: number, routeId: number, contribution: Contribution): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions`;
    return this.http.post<void>(url, contribution);
  }

  public updateContribution(fileId: number, routeId: number, contribution: Contribution): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contribution.id}`;
    return this.http.put<void>(url, contribution);
  }

  public deleteContribution(fileId: number, routeId: number, contribution: Contribution): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contribution.id}`;
    return this.http.delete<void>(url);
  }
}
