import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Client, File, FileStatusCode } from '../../models/File.model';
import { ClientsService } from '../../services/clients.service';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-file-tracking',
  templateUrl: './file-tracking.component.html',
  styleUrls: ['./file-tracking.component.scss'],
})
export class FileTrackingComponent implements OnInit {
  
  public clients$: Observable<Client[]>;
  public clientsInput$ = new Subject<string>();
  public clientsLoading = false;
  
  public dataSource = new MatTableDataSource<File>();
  public displayedColumns = [
    'code',
    'description',
    'status-name',
    'client-name',
  ];
  public paginatorLength: number = 0;
  public paginatorSize: number = 0;
  private fileSearchFilter: SearchFilter = {};

  public fileFilterForm: FormGroup = this.fb.group({
    filter_code: [''],
    filter_clientId: [''],
    'filter_status.code': [FileStatusCode.PREFLIGHT]
  });

  constructor(
    private readonly fileService: FilesService,
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.getFileData();
    this.fileFilterFormValueChangesSubscribe();
  }

  private getFileData(fileSearchFilter: SearchFilter = {}) {
    fileSearchFilter = {
      ...fileSearchFilter,
      ...this.fileFilterForm.value
    };
    this.fileService.getFiles(fileSearchFilter).subscribe(this.updateFilesData);
  }

  private fileFilterFormValueChangesSubscribe(): void {
    this.fileFilterForm.valueChanges
      .pipe(debounceTime(400), map(this.createSearchFilter))
      .subscribe((searchFilter) => this.getFileData(searchFilter));
  }
  
  private getSearchFilterNullableValue(value: any) {
    return value ?? '';
  }

  private createSearchFilter = (formValue: any): SearchFilter => {
    return {
      ...formValue,
      filter_statusId: this.getSearchFilterNullableValue(
        formValue.filter_statusId
      ),
      filter_clientId: this.getSearchFilterNullableValue(
        formValue.filter_clientId
      ),
    };
  };

  private updateFilesData = (files: Page<File>) => {
    this.dataSource = new MatTableDataSource<File>(files.content);
    this.paginatorLength = files.totalElements;
    this.paginatorSize = files.size;
  };

  public isBookedBlue(file: File): boolean {
    return file.status?.code === FileStatusCode.BLUE_BOOKED;
  }

  public isBookedGreen(file: File): boolean {
    return file.status?.code === FileStatusCode.GREEN_BOOKED;
  }
  
  private loadClients(): void {
    this.clients$ = concat(
      of([]), // default items
      this.clientsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.clientsLoading = true)),
        switchMap(
          (term: string): Observable<Client[]> =>
            this.clientsService.getClients({ filter_name: term }).pipe(
              map((page: Page<Client>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.clientsLoading = false))
            )
        )
      )
    );
  }

  public goToTracking(file: File) {
    console.log('test');

    this.router.navigate(['files/tracking', file.id]);
  }

  public onSortFiles(sort: Sort) {
    console.log(sort);
    this.fileSearchFilter['sort'] = `${sort.active.replace('-', '.')},${
      sort.direction
    }`;
    this.getFileData(this.fileSearchFilter);
  }

  public onPage(pageEvent: PageEvent) {
    this.fileSearchFilter['page'] = pageEvent.pageIndex.toString();
    this.fileSearchFilter['size'] = pageEvent.pageSize.toString();
    this.getFileData(this.fileSearchFilter);
  }
}
