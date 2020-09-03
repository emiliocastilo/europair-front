import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TimeZone } from '../models/base/time-zone';

@Injectable({
  providedIn: 'root'
})
export class TimeConversionService {
  private readonly url = `${environment.apiUrl}conversions/time`;
  constructor(private readonly httpClient: HttpClient) { }

  public getTimeZones(): Observable<TimeZone[]> {
    return this.httpClient.get<TimeZone[]>(this.url);
  }
}
