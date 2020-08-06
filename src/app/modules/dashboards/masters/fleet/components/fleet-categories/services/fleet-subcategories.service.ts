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
  private readonly url = `${environment.apiUrl}fleet/subcategories`;
  constructor(private http: HttpClient) { }

  public getFleetSubcategories(): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : this.url;
    return this.http.get<Page<FleetSubcategory>>(url);
  }

  public getFleetSubcategoriesFromCategory(category: FleetCategory): Observable<Page<FleetSubcategory>> {
    const url: string = this.mocked ? '/assets/mocks/subcategories.json' : `${this.url}?category=${category.id}`;
    return this.http.get<Page<FleetSubcategory>>(url);
  }

  public addFleetSubcategory(fleetSubcategory: FleetSubcategory): Observable<FleetSubcategory> {
    return this.http.post<FleetSubcategory>(this.url, fleetSubcategory);
  }

  public editFleetSubcategory(fleetSubcategory: FleetSubcategory): Observable<FleetSubcategory> {
    return this.http.put<FleetSubcategory>(`${this.url}/${fleetSubcategory.id}`, fleetSubcategory);
  }

  public deleteFleetSubcategory(fleetSubcategory: FleetSubcategory): Observable<void> {
    return this.http.delete<void>(`${this.url}/${fleetSubcategory.id}`);
  }
}
