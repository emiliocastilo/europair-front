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
import { File } from '../models/File.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}files`;
  private readonly filterOptions: FilterOptions = {} as const;

  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public searchFile(text: string = '', pageable: any): Observable<Page<File>> {
    const params = new HttpParams();
    params.set('text', text);
    params.set('pageable', String(pageable));
    const searchFileUrl = `${this.url}/search`;
    return this.http.get<Page<File>>(searchFileUrl, { params });
  }

  public getFiles(searchFilter: SearchFilter = {}): Observable<Page<File>> {
    return this.http.get<Page<File>>(this.url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getFileById(fileId: number): Observable<File> {
    const getFilerUrl = `${this.url}/${fileId}`;
    return this.http.get<File>(getFilerUrl);
  }

  public saveFile(file: File): Observable<File> {
    return file.id ? this.updateFile(file) : this.createFile(file);
  }

  private createFile(file: File): Observable<File> {
    return this.http.post<File>(this.url, file);
  }

  private updateFile(file: File): Observable<File> {
    const updateFileUrl = `${this.url}/${file.id}`;
    return this.http.put<File>(updateFileUrl, file);
  }

  public removeFile(file: File) {
    const removeFileUrl = `${this.url}/${file.id}`;
    return this.http.delete(removeFileUrl);
  }
}
