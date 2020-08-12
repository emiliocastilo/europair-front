import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetSubcategory, FleetCategory } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FleetSubcategoriesService {

  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}aircraft-categories`;
  private readonly subcategory_url: string = 'subcategories';
  constructor(private http: HttpClient) { }

  public getFleetSubcategories(): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : this.url;
    return this.http.get<Page<FleetSubcategory>>(url);
  }

  public getFleetSubcategoriesFromCategory(category: FleetCategory): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : `${this.url}/${category.id}/${this.subcategory_url}`;
    return this.http.get<Page<FleetSubcategory>>(url);
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
