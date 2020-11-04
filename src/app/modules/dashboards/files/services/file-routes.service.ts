import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  FilterOptions,
  SearchFilter,
} from 'src/app/core/models/search/search-filter';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { FileRoute } from '../models/FileRoute.model';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable({
  providedIn: 'root',
})
export class FileRoutesService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}files`;
  private readonly filterOptions: FilterOptions = {
    filter_routeState: OperatorEnum.EQUALS,
    filter_removedAt: OperatorEnum.IS_NULL,
  } as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public searchFileRoute(
    text: string = '',
    pageable: any
  ): Observable<Page<FileRoute>> {
    const params = new HttpParams();
    params.set('text', text);
    params.set('pageable', String(pageable));
    const searchFileRouteUrl = `${this.url}/search`;
    return this.http.get<Page<FileRoute>>(searchFileRouteUrl, { params });
  }

  public getFileRoutes(
    fileId: number,
    searchFilter: SearchFilter = {}
  ): Observable<Page<FileRoute>> {
    const url: string = this.mocked
      ? '/assets/mocks/fileRoutes.json'
      : `${this.url}/${fileId}/routes`;

    return this.http.get<Page<FileRoute>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getFileRouteById(
    fileId: number,
    routeId: number
  ): Observable<FileRoute> {
    const url: string = `${this.url}/${fileId}/routes/${routeId}`;

    return this.http.get<FileRoute>(url);
  }

  public deleteFileRouteById(
    fileId: number,
    routeId: number
  ): Observable<void> {
    const url: string = `${this.url}/${fileId}/routes/${routeId}`;

    return this.http.delete<void>(url);
  }

  public createFileRoute(
    fileId: number,
    fileRoute: FileRoute
  ): Observable<FileRoute> {
    const url: string = `${this.url}/${fileId}/routes`;
    return this.http.post<FileRoute>(url, fileRoute);
  }
}
