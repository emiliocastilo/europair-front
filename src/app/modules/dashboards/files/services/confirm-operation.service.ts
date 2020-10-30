import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { environment } from 'src/environments/environment';
import { ConfirmOperation } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})

export class ConfirmOperationService {
  private readonly mocked: boolean = environment.mock;
  private readonly url: string = `${environment.apiUrl}files/`;

  constructor(
    private http: HttpClient
  ) { }

  public getConfirmOperations(fileId: number): Observable<Page<ConfirmOperation>> {
    const url: string = this.mocked
      ? '/assets/mocks/**.json'
      : `${this.url}${fileId}/additional-data`;
    return this.http.get<Page<ConfirmOperation>>(url);
  }

  // public createConfirmOperation(fileId: number, confirmOperation: ConfirmOperation): Observable<void> {
  //   const url: string = `${this.url}${fileId}/additional-data`;
  //   return this.http.post<void>(url, confirmOperation);
  // }

  public updateConfirmOperation(fileId: number, confirmOperation: ConfirmOperation): Observable<void> {
    const url: string = `${this.url}${fileId}/additional-data`;
    return this.http.post<void>(url, confirmOperation);
  }

  public deleteConfirmOperation(fileId: number): Observable<void> {
    const url: string = `${this.url}${fileId}/additional-data`;
    return this.http.delete<void>(url);
  }
}
