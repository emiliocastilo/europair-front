import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { Services } from '../models/services.model';
@Injectable({
  providedIn: 'root',
})

export class ServicesService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}services`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
  } as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) { }

  public getServices(searchFilter: SearchFilter = {}): Observable<Page<Services>> {
    const url: string = this.mocked
      ? '/assets/mocks/services.json'
      : this.url;
    return this.http.get<Page<Services>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getServiceById(serviceId: number): Observable<Services> {
    return this.http.get<Services>(`${this.url}/${serviceId}`);
  }

  public saveService(services: Services): Observable<void> {
    return services.id ? this.updateServices(services) : this.createServices(services);
  }

  private createServices(services: Services): Observable<void> {
    return this.http.post<void>(this.url, services);
  }

  private updateServices(services: Services): Observable<void> {
    return this.http.put<void>(`${this.url}/${services.id}`, services);
  }

  public deleteServices(services: Services): Observable<void> {
    return this.http.delete<void>(`${this.url}/${services.id}`);
  }
}
