import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Aircraft } from '../models/Aircraft.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftService {
  private readonly url = `${environment.apiUrl}aircraft`;
  constructor(private http: HttpClient) {}

  public getAircraft(): Observable<Page<Aircraft>> {
    return environment.mock
      ? this.http.get<Page<Aircraft>>('/assets/mocks/aircraft.json')
      : this.http.get<Page<Aircraft>>(this.url);
  }

  public saveAircraft(aircraft: Aircraft): Observable<Aircraft> {
    return aircraft.id
      ? this.updateAircraft(aircraft)
      : this.createAircraft(aircraft);
  }

  private createAircraft(aircraft: Aircraft): Observable<Aircraft> {
    return this.http.post<Aircraft>(this.url, aircraft);
  }

  private updateAircraft(aircraft: Aircraft): Observable<Aircraft> {
    const updateAircraftUrl = `${this.url}/${aircraft.id}`;
    return this.http.put<Aircraft>(updateAircraftUrl, aircraft);
  }

  public removeAircraft(aircraft: Aircraft) {
    const removeAircraftUrl = `${this.url}/${aircraft.id}`;
    return this.http.delete(removeAircraftUrl);
  }
}
