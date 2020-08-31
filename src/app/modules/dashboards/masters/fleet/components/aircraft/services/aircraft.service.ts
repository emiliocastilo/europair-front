import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  Aircraft,
  AircraftBase,
  AircraftObservation,
} from '../models/Aircraft.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftService {
  private readonly url = `${environment.apiUrl}aircrafts`;
  constructor(private http: HttpClient) {}

  public getAircraft(): Observable<Page<Aircraft>> {
    return this.http.get<Page<Aircraft>>(this.url);
  }

  public searchAircraftForAirport(airportId: string): Observable<Page<Aircraft>> {
    const params: HttpParams = new HttpParams().set('filter_bases.airport.id', `${airportId},EQUALS`);
    return this.http.get<Page<Aircraft>>(this.url, {params});
  }

  public searchAircraftForOperator(operatorId: string): Observable<Page<Aircraft>> {
    const params: HttpParams = new HttpParams().set('filter_operator.id', `${operatorId},EQUALS`);
    return this.http.get<Page<Aircraft>>(this.url, {params});
  }

  public getAircraftById(aircraftId: number): Observable<Aircraft> {
    const getAircraftUrl = `${this.url}/${aircraftId}`;
    return this.http.get<Aircraft>(getAircraftUrl);
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

  public getAircraftBases(aircraftId: number): Observable<Page<AircraftBase>> {
    const getAircraftBases = `${this.url}/${aircraftId}/bases`;
    return this.http.get<Page<AircraftBase>>(getAircraftBases);
  }

  public getAircraftBaseById(
    aircraftId: number,
    baseId: number
  ): Observable<AircraftBase> {
    const getAircraftBasesById = `${this.url}/${aircraftId}/bases/${baseId}`;
    return this.http.get<AircraftBase>(getAircraftBasesById);
  }

  public saveAircraftBase(
    aircraftId: number,
    base: AircraftBase
  ): Observable<AircraftBase> {
    return base.id
      ? this.updateAircraftBase(aircraftId, base)
      : this.createAircraftBase(aircraftId, base);
  }

  private createAircraftBase(
    operatorId: number,
    base: AircraftBase
  ): Observable<AircraftBase> {
    const createCertificationUrl = `${this.url}/${operatorId}/bases`;
    return this.http.post<AircraftBase>(createCertificationUrl, base);
  }

  private updateAircraftBase(
    aircraftId: number,
    base: AircraftBase
  ): Observable<AircraftBase> {
    const updateCertificationUrl = `${this.url}/${aircraftId}/bases/${base.id}`;
    return this.http.put<AircraftBase>(updateCertificationUrl, base);
  }

  public removeAircraftBase(aircraftId: number, baseId: number) {
    const removeAircraftBaseUrl = `${this.url}/${aircraftId}/bases/${baseId}`;
    return this.http.delete(removeAircraftBaseUrl);
  }

  public getAircraftObservations(
    aircraftId: number
  ): Observable<Page<AircraftObservation>> {
    const getAircraftObservations = `${this.url}/${aircraftId}/observations`;
    return this.http.get<Page<AircraftObservation>>(getAircraftObservations);
  }

  public getAircraftObservationById(
    aircraftId: number,
    observationId: number
  ): Observable<AircraftObservation> {
    const getAircraftObservationById = `${this.url}/${aircraftId}/observations/${observationId}`;
    return this.http.get<AircraftObservation>(getAircraftObservationById);
  }

  public saveAircraftObservation(
    aircraftId: number,
    observation: AircraftObservation
  ): Observable<AircraftObservation> {
    return observation.id
      ? this.updateAircraftObservation(aircraftId, observation)
      : this.createAircraftObservation(aircraftId, observation);
  }

  private createAircraftObservation(
    operatorId: number,
    observation: AircraftObservation
  ): Observable<AircraftObservation> {
    const createObservationUrl = `${this.url}/${operatorId}/observations`;
    return this.http.post<AircraftObservation>(
      createObservationUrl,
      observation
    );
  }

  private updateAircraftObservation(
    aircraftId: number,
    observation: AircraftObservation
  ): Observable<AircraftObservation> {
    const updateObservationUrl = `${this.url}/${aircraftId}/observations/${observation.id}`;
    return this.http.put<AircraftObservation>(
      updateObservationUrl,
      observation
    );
  }

  public removeAircraftObservation(aircraftId: number, observationId: number) {
    const removeAircraftObservationUrl = `${this.url}/${aircraftId}/observations/${observationId}`;
    return this.http.delete(removeAircraftObservationUrl);
  }
}
