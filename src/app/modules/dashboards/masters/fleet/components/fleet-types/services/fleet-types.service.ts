import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetType } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FleetTypesService {

  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}fleet/types`;
  constructor(private http: HttpClient) {}

  public getFleetTypes(): Observable<Page<FleetType>> {
    const url: string = this.mocked ? '/assets/mocks/fleet-types.json' : this.url;
    return this.http.get<Page<FleetType>>(url);
  }

  public addFleetType(fleetType: FleetType): Observable<FleetType> {
    return this.http.post<FleetType>(this.url, fleetType);
  }

  public editFleetType(fleetType: FleetType): Observable<FleetType> {
    return this.http.put<FleetType>(`${this.url}/${fleetType.id}`, fleetType);
  }

  public deleteFleetType(fleetType: FleetType): Observable<void> {
    return this.http.delete<void>(`${this.url}/${fleetType.id}`);
  }
}
