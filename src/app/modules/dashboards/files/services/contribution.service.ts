import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import {
  FilterOptions,
  SearchFilter,
} from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import {
  Contribution,
  ContributionStates,
} from '../components/search-aircraft/models/contribution.model';

@Injectable({
  providedIn: 'root',
})
export class ContributionService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}files/`;
  private readonly filterOptions: FilterOptions = {
    filter_removedAt: OperatorEnum.IS_NULL,
  } as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getContributions(
    fileId: number,
    routeId: number,
    searchFilter: SearchFilter = {}
  ): Observable<Page<Contribution>> {
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

  public getContributionsWithTableData(
    fileId: number,
    routeId: number,
    searchFilter: SearchFilter = {}
  ): Observable<Contribution[]> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}${fileId}/routes/${routeId}/withcontribution`;
    return this.http.get<Contribution[]>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getContribution(
    fileId: number,
    routeId: number,
    contributionId: number
  ): Observable<Contribution> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contributionId}`;
    return this.http.get<Contribution>(url);
  }

  public createContribution(
    fileId: number,
    routeId: number,
    contribution: Contribution
  ): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions`;
    return this.http.post<void>(url, contribution);
  }

  public updateContribution(
    fileId: number,
    routeId: number,
    contribution: Contribution
  ): Observable<Contribution> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contribution.id}`;
    return this.http.put<Contribution>(url, contribution);
  }

  public updateContributionsState(
    fileId: number,
    routeId: number,
    contribution: Contribution,
    contributionState: ContributionStates
  ): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/state`;
    return this.http.put<void>(url, {
      idList: [contribution.id],
      state: contributionState,
    });
  }

  public deleteContribution(
    fileId: number,
    routeId: number,
    contribution: Contribution
  ): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contribution.id}`;
    return this.http.delete<void>(url);
  }
}
