import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FilterOptions,
  SearchFilter,
} from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';
import { environment } from 'src/environments/environment';
import { File, FileStatus, FileStatusCode } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})
export class FileStatusService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}fileStatus`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getStatus(
    searchFilter: SearchFilter = {}
  ): Observable<Page<FileStatus>> {
    const url: string = this.mocked
      ? '/assets/mocks/file-status.json'
      : this.url;
    return this.http.get<Page<FileStatus>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getAvailableStatus(fileStatus: FileStatus): Observable<Page<FileStatus>> {
    const url: string = this.mocked ? '/assets/mocks/file-status.json' : this.url;
    const params = new HttpParams().set('fileStatusId', fileStatus.id.toString());
    return this.http.get<Page<FileStatus>>(url, { params });
  }
}
