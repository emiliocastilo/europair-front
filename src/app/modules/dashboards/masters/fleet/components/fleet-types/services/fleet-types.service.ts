import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  FleetType,
  FleetTypeObservation,
  AverageSpeed,
} from '../../../models/fleet';
import { Page } from 'src/app/core/models/table/pagination/page';

@Injectable({
  providedIn: 'root',
})
export class FleetTypesService {
  private readonly url = `${environment.apiUrl}aircraft-types`;

  constructor(private http: HttpClient) {}

  public getFleetTypes(showDisabled: boolean): Observable<Page<FleetType>> {
    const params: HttpParams = new HttpParams().set(
      'showDisabled',
      String(showDisabled)
    );
    return this.http.get<Page<FleetType>>(this.url, { params });
  }

  public getFleetTypeById(typeId: number): Observable<FleetType> {
    return this.http.get<FleetType>(`${this.url}/${typeId}`);
  }

  public saveFleetType(fleetType: FleetType): Observable<FleetType> {
    return fleetType.id
      ? this.editFleetType(fleetType)
      : this.addFleetType(fleetType);
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

  public getFleetTypeObservations(
    fleetTypeId: number
  ): Observable<Page<FleetTypeObservation>> {
    const getFleetTypeObservations = `${this.url}/${fleetTypeId}/observations`;
    return this.http.get<Page<FleetTypeObservation>>(getFleetTypeObservations);
  }

  public getFleetTypeObservationById(
    fleetTypeId: number,
    observationId: number
  ): Observable<FleetTypeObservation> {
    const getFleetTypeObservationById = `${this.url}/${fleetTypeId}/observations/${observationId}`;
    return this.http.get<FleetTypeObservation>(getFleetTypeObservationById);
  }

  public saveFleetTypeObservation(
    fleetTypeId: number,
    observation: FleetTypeObservation
  ): Observable<FleetTypeObservation> {
    return observation.id
      ? this.updateFleetTypeObservation(fleetTypeId, observation)
      : this.createFleetTypeObservation(fleetTypeId, observation);
  }

  private createFleetTypeObservation(
    fleetTypeId: number,
    observation: FleetTypeObservation
  ): Observable<FleetTypeObservation> {
    const createObservationUrl = `${this.url}/${fleetTypeId}/observations`;
    return this.http.post<FleetTypeObservation>(
      createObservationUrl,
      observation
    );
  }

  private updateFleetTypeObservation(
    fleetTypeId: number,
    observation: FleetTypeObservation
  ): Observable<FleetTypeObservation> {
    const updateObservationUrl = `${this.url}/${fleetTypeId}/observations/${observation.id}`;
    return this.http.put<FleetTypeObservation>(
      updateObservationUrl,
      observation
    );
  }

  public removeFleetTypeObservation(
    fleetTypeId: number,
    observationId: number
  ) {
    const removeFleetTypeObservationUrl = `${this.url}/${fleetTypeId}/observations/${observationId}`;
    return this.http.delete(removeFleetTypeObservationUrl);
  }

  public getFleetTypeSpeedAverages(
    fleetTypeId: number
  ): Observable<Page<AverageSpeed>> {
    const getFleetTypeSpeedAverage = `${this.url}/${fleetTypeId}/average-speed`;
    return this.http.get<Page<AverageSpeed>>(getFleetTypeSpeedAverage);
  }

  public getFleetTypeSpeedAverageById(
    fleetTypeId: number,
    speedAverageId: number
  ): Observable<FleetTypeObservation> {
    const getFleetTypeSpeedAverageById = `${this.url}/${fleetTypeId}/average-speed/${speedAverageId}`;
    return this.http.get<FleetTypeObservation>(getFleetTypeSpeedAverageById);
  }

  public saveFleetTypeSpeedAverage(
    fleetTypeId: number,
    speedAverage: AverageSpeed
  ): Observable<AverageSpeed> {
    return speedAverage.id
      ? this.updateFleetTypeSpeedAverage(fleetTypeId, speedAverage)
      : this.createFleetTypeSpeedAverage(fleetTypeId, speedAverage);
  }

  private createFleetTypeSpeedAverage(
    fleetTypeId: number,
    speedAverage: AverageSpeed
  ): Observable<AverageSpeed> {
    const createSpeedUrl = `${this.url}/${fleetTypeId}/average-speed`;
    return this.http.post<AverageSpeed>(createSpeedUrl, speedAverage);
  }

  private updateFleetTypeSpeedAverage(
    fleetTypeId: number,
    speedAverage: AverageSpeed
  ): Observable<AverageSpeed> {
    const updateSpeedAverageUrl = `${this.url}/${fleetTypeId}/average-speed/${speedAverage.id}`;
    return this.http.put<AverageSpeed>(updateSpeedAverageUrl, speedAverage);
  }

  public removeFleetTypeSpeedAverage(
    fleetTypeId: number,
    speedAverageId: number
  ) {
    const removeFleetTypeSpeedAverageUrl = `${this.url}/${fleetTypeId}/average-speed/${speedAverageId}`;
    return this.http.delete(removeFleetTypeSpeedAverageUrl);
  }
}
