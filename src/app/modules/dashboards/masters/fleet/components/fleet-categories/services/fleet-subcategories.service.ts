import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetSubcategory, FleetCategory } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';

@Injectable({
  providedIn: 'root',
})
export class FleetSubcategoriesService {

  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}aircraft-categories`;
  private readonly subcategory_url: string = 'subcategories';
  private readonly filterOptions: FilterOptions = {
    filter_code: OperatorEnum.CONTAINS,
    filter_order: OperatorEnum.EQUALS,
    filter_name: OperatorEnum.CONTAINS,
    } as const;

  constructor(private http: HttpClient, private searchFilterService: SearchFilterService) { }

  public getFleetSubcategories(): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : this.url;
    return this.http.get<Page<FleetSubcategory>>(url);
  }

  public getFleetSubcategoriesFromCategory(category: FleetCategory, searchFilter: SearchFilter = {}): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : `${this.url}/${category.id}/${this.subcategory_url}`;
    return this.http.get<Page<FleetSubcategory>>(url, {
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions)
    });
  }

  public addFleetSubcategory(fleetCategory: FleetCategory, fleetSubcategory: FleetSubcategory): Observable<FleetSubcategory> {
    return this.http.post<FleetSubcategory>(`${this.url}/${fleetCategory.id}/${this.subcategory_url}`, fleetSubcategory);
  }

  public editFleetSubcategory(fleetCategory: FleetCategory, fleetSubcategory: FleetSubcategory): Observable<FleetSubcategory> {
    return this.http.put<FleetSubcategory>(`${this.url}/${fleetCategory.id}/${this.subcategory_url}/${fleetSubcategory.id}`, fleetSubcategory);
  }

  public deleteFleetSubcategory(fleetCategory: FleetCategory, fleetSubcategory: FleetSubcategory): Observable<void> {
    return this.http.delete<void>(`${this.url}/${fleetCategory.id}/${this.subcategory_url}/${fleetSubcategory.id}`);
  }
}
