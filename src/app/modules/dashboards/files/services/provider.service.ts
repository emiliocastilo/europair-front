import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Provider } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})

export class ProviderService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}providers`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getProviders(searchFilter: SearchFilter = {}): Observable<Page<Provider>> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : this.url;
    return this.http.get<Page<Provider>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public createProvider(provider: Provider): Observable<void> {
    return this.http.post<void>(this.url, provider);
  }

  public updateProvider(provider: Provider): Observable<void> {
    return this.http.put<void>(`${this.url}/${provider.id}`, provider);
  }

  public deleteProvider(provider: Provider): Observable<void> {
    return this.http.delete<void>(`${this.url}/${provider.id}`);
  }
}
