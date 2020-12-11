import { Injectable } from '@angular/core';
import { Region } from '../models/region';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from 'src/app/core/models/table/pagination/page';
import { environment } from 'src/environments/environment';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}regions`;
  private readonly filterOptions: FilterOptions = {
    filter_code: OperatorEnum.CONTAINS,
    filter_name: OperatorEnum.CONTAINS,
    } as const;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly searchFilterService: SearchFilterService) { }

  public getRegions(searchFilter: SearchFilter = {}): Observable<Page<Region>> {
    const url: string = this.mocked ? '/assets/mocks/regions.json' : this.url;
    return this.httpClient.get<Page<Region>>(url, {
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions)
    });
  }

  public addRegion(region: Region): Observable<Region> {
    if (this.mocked) {
      region.id = Math.floor(Math.random() * 100);
      return of(region);
    } else {
      return this.httpClient.post<Region>(this.url, region);
    }
  }

  public editRegion(region: Region): Observable<Region> {
    if (this.mocked) {
      return of(region);
    } else {
      return this.httpClient.put<Region>(`${this.url}/${region.id}`, region);
    }
  }

  public deleteRegion(region: Region): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${region.id}`);
  }
}
