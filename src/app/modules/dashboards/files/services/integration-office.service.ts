import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { File } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})

export class IntegrationOfficeService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}integration/office`;

  constructor(
    private http: HttpClient
  ) { }

  public generatePlanning(file: File): Observable<void> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}${file.id}/planning`;
    return this.http.post<void>(url, {fileId: file.id});
  }
}
