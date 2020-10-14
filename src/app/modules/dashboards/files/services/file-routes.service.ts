import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilterOptions } from 'src/app/core/models/search/search-filter';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { FileRoute } from '../models/FileRoute.model';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FileRoutesService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}files`;
  private readonly filterOptions: FilterOptions = {} as const;

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

  public getFileRoutes(fileId: number): Observable<Page<FileRoute>> {
    const url: string = this.mocked
      ? '/assets/mocks/fileRoutes.json'
      : `${this.url}/${fileId}/routes`;

    return this.http.get<Page<FileRoute>>(url);
  }

  public getFileRouteById(fileId: number, routeId: number): Observable<FileRoute> {
    const url: string = `${this.url}/${fileId}/routes/${routeId}`;
    return this.http.get<FileRoute>(url);
  }

  public createFileRoute(
    fileId: number,
    fileRoute: FileRoute
  ): Observable<FileRoute> {
    const url: string = `${this.url}/${fileId}/routes`;
    return this.http.post<FileRoute>(url, fileRoute);
  }
}
