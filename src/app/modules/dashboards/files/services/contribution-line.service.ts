import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import {
  FilterOptions,
  SearchFilter,
} from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import {
  ContributionLine,
  LineContributionRouteType,
} from '../models/ContributionLine.model';

@Injectable({
  providedIn: 'root',
})
export class ContributionLineService {
  private readonly url: string = `${environment.apiUrl}files/`;
  private readonly filterOptions: FilterOptions = {
    filter_lineContributionRouteType: OperatorEnum.EQUALS,
    filter_removedAt: OperatorEnum.IS_NULL,
  } as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getPurchaseContributionLines(
    fileId: number,
    routeId: number,
    contributionId: number
  ): Observable<Page<ContributionLine>> {
    return this.getContributionLines(
      fileId,
      routeId,
      contributionId,
      this.getPurchaseSearchFilter()
    );
  }

  public getSaleContributionLines(
    fileId: number,
    routeId: number,
    contributionId: number
  ): Observable<Page<ContributionLine>> {
    return this.getContributionLines(
      fileId,
      routeId,
      contributionId,
      this.getSaleSearchFilter()
    );
  }

  public getContributionLines(
    fileId: number,
    routeId: number,
    contributionId: number,
    searchFilter: SearchFilter = {},
    filterOptions: FilterOptions = {}
  ): Observable<Page<ContributionLine>> {
    filterOptions = { ...filterOptions, ...this.filterOptions };
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contributionId}/linecontributionroute`;
    return this.http.get<Page<ContributionLine>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        filterOptions
      ),
    });
  }

  public createPurchaseContributionLine(
    fileId: number,
    routeId: number,
    contributionId: number,
    line: ContributionLine
  ): Observable<number> {
    return this.createContributionLine(fileId, routeId, contributionId, {
      ...line,
      routeId: routeId,
      contributionId: contributionId,
      lineContributionRouteType: LineContributionRouteType.PURCHASE,
    });
  }

  public createSaleContributionLine(
    fileId: number,
    routeId: number,
    contributionId: number,
    line: ContributionLine
  ): Observable<number> {
    return this.createContributionLine(fileId, routeId, contributionId, {
      ...line,
      routeId: routeId,
      contributionId: contributionId,
      lineContributionRouteType: LineContributionRouteType.SALE,
    });
  }

  public createContributionLine(
    fileId: number,
    routeId: number,
    contributionId: number,
    line: ContributionLine
  ): Observable<number> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contributionId}/linecontributionroute`;
    return this.http.post<number>(url, line);
  }

  public deleteContributionLine(
    fileId: number,
    routeId: number,
    contributionId: number,
    line: ContributionLine
  ): Observable<void> {
    const url: string = `${this.url}${fileId}/routes/${routeId}/contributions/${contributionId}/linecontributionroute/${line.id}`;
    return this.http.delete<void>(url);
  }

  private getPurchaseSearchFilter(): SearchFilter {
    return {
      size: '1000',
      filter_lineContributionRouteType: LineContributionRouteType.PURCHASE,
      filter_removedAt: null,
    };
  }

  private getSaleSearchFilter(): SearchFilter {
    return {
      size: '1000',
      filter_lineContributionRouteType: LineContributionRouteType.SALE,
      filter_removedAt: null,
    };
  }
}
