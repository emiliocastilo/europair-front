import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  Aircraft,
  AircraftBase,
  AircraftObservation,
} from '../models/Aircraft.model';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { SearchFilter, FilterOptions } from 'src/app/core/models/search/search-filter';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';

@Injectable({
  providedIn: 'root',
})
export class AircraftService {
  private readonly url = `${environment.apiUrl}aircrafts`;
  private readonly filterOptions: FilterOptions = {
    'filter_operator.name': OperatorEnum.CONTAINS,
    'filter_aircraftType.code': OperatorEnum.CONTAINS,
    'filter_aircraftType.category.code': OperatorEnum.CONTAINS,
    'filter_aircraftType.subcategory.code': OperatorEnum.CONTAINS,
    filter_plateNumber: OperatorEnum.CONTAINS,
    filter_productionYear: OperatorEnum.EQUALS,
    filter_insideUpgradeYear: OperatorEnum.EQUALS,
    filter_quantity: OperatorEnum.EQUALS,
    'filter_bases.airport.id': OperatorEnum.EQUALS,
    'filter_operator.id': OperatorEnum.EQUALS,
    'filter_bases.airport.iataCode': OperatorEnum.CONTAINS,
    filter_removedAt: OperatorEnum.IS_NULL,
    } as const;
    
  constructor(private http: HttpClient, private searchFilterService: SearchFilterService) {}

  public getAircraft(searchFilter: SearchFilter = {}): Observable<Page<Aircraft>> {
    return this.http.get<Page<Aircraft>>(this.url, {
      params: this.searchFilterService.createHttpParams(searchFilter, this.filterOptions)
    });
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
