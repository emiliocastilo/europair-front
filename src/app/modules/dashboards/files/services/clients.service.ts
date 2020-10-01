import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FilterOptions,
  SearchFilter,
} from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Client } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}clients`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getClients(searchFilter: SearchFilter = {}): Observable<Page<Client>> {
    const url: string = this.mocked
      ? '/assets/mocks/clients.json'
      : this.url;
    return this.http.get<Page<Client>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }
}
