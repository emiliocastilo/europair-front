import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FleetType } from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FleetTypesService {
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}aircraft-types`;
  constructor(private http: HttpClient) {}

  public getFleetTypes(showDisabled: boolean): Observable<Page<FleetType>> {
    const params: HttpParams = new HttpParams().set(
      'showDisabled',
      String(showDisabled)
    );
    return this.http.get<Page<FleetType>>(this.url, { params });
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
