import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetCategory } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FleetCategoriesService {

  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}fleet/categories`;
  constructor(private http: HttpClient) {}

  public getFleetCategories(): Observable<Page<FleetCategory>> {
    const url: string = this.mocked ? '/assets/mocks/categories.json' : this.url;
    return this.http.get<Page<FleetCategory>>(url);
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
