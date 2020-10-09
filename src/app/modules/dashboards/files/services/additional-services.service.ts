import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { AdditionalService } from '../models/AdditionalService.model';

@Injectable({
  providedIn: 'root',
})

export class AdditionalServiceService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}files`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getAdditionalServices(fileId: number, routeId: number, searchFilter: SearchFilter = {}): Observable<Page<AdditionalService>> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}/${fileId}/routes/${routeId}/flights/services`;
    return this.http.get<Page<AdditionalService>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public createAdditionalService(fileId: number, routeId: number, additionalService: AdditionalService): Observable<void> {
    return this.http.post<void>(`${this.url}/${fileId}/routes/${routeId}/flights/services`, additionalService);
  }

  public updateAdditionalService(fileId: number, routeId: number, additionalService: AdditionalService): Observable<void> {
    return this.http.put<void>(`${this.url}/${fileId}/routes/${routeId}/services/${additionalService.id}`, additionalService);
  }

  public deleteAdditionalService(fileId: number, routeId: number, additionalService: AdditionalService): Observable<void> {
    return this.http.delete<void>(`${this.url}/${fileId}/routes/${routeId}/services/${additionalService.id}`);
  }
}
