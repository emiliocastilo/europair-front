import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { FileRoute } from '../models/FileRoute.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  // private readonly mocked: boolean = environment.mock;
  private readonly mocked: boolean = true;
  private readonly url = `${environment.apiUrl}files`;

  constructor(private http: HttpClient) {}

  public getFileRoutes(fileId: number): Observable<Page<FileRoute>> {
    const url: string = this.mocked
      ? '/assets/mocks/fileRoutes.json'
      : `${this.url}/${fileId}/routes`;

    return this.http.get<Page<FileRoute>>(url);
  }
}
