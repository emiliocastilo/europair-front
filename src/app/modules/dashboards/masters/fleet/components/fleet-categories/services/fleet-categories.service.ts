import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetCategory } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';

@Injectable({
  providedIn: 'root',
})
export class FleetCategoriesService {

  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}aircraft-categories`;
  private readonly filterOptions: FilterOptions = {
    filter_code: OperatorEnum.CONTAINS,
    filter_name: OperatorEnum.CONTAINS,
    } as const;
    
  constructor(private http: HttpClient, private searchFilterService: SearchFilterService) {}

  public getFleetCategories(searchFilter: SearchFilter = {}): Observable<Page<FleetCategory>> {
    const url: string = this.mocked ? '/assets/mocks/categories.json' : this.url;
    return this.http.get<Page<FleetCategory>>(url,{
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions)
    });
  }

  public addFleetCategory(fleetCategory: FleetCategory): Observable<FleetCategory> {
    return this.http.post<FleetCategory>(this.url, fleetCategory);
  }

  public editFleetCategory(fleetCategory: FleetCategory): Observable<FleetCategory> {
    return this.http.put<FleetCategory>(`${this.url}/${fleetCategory.id}`, fleetCategory);
  }

  public deleteFleetCategory(fleetCategory: FleetCategory): Observable<void> {
    return this.http.delete<void>(`${this.url}/${fleetCategory.id}`);
  }
}
