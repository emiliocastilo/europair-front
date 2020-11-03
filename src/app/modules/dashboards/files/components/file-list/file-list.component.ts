import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, concat, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import {
  Client,
  File,
  FileStatus,
  FileStatusCode,
} from '../../models/File.model';
import { ClientsService } from '../../services/clients.service';
import { FileStatusService } from '../../services/file-status.service';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  public dataSource = new MatTableDataSource<File>();
  public displayedColumns = [
    'code',
    'description',
    'status-name',
    'client-name',
  ];
  public paginatorLength: number = 0;
  public paginatorSize: number = 0;
  private fileSearchFilter: SearchFilter;
  public fileStatus$: Observable<FileStatus[]>;
  public clients$: Observable<Client[]>;
  public clientsInput$ = new Subject<string>();
  public clientsLoading = false;
  private selectedClient$ = new BehaviorSubject<Client[]>([]);

  public fileFilterForm: FormGroup = this.fb.group({
    filter_code: [''],
    filter_statusId: [''],
    filter_clientId: [''],
  });

  constructor(
    private readonly fileService: FilesService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly fileStatusService: FileStatusService,
    private readonly clientsService: ClientsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSelectsData();
    this.initializeFilters();
    this.refreshScreenData();
    this.fileFilterFormValueChangesSubscribe();
  }

  private initializeFilters() {
    this.fileSearchFilter =
      Object.keys(this.route.snapshot.queryParams).length > 0
        ? this.route.snapshot.queryParams
        : { sort: 'code,DESC' };
    console.log(this.fileSearchFilter);
    this.fileFilterForm.patchValue(
      this.getFilterFormValue(this.fileSearchFilter)
    );
  }

  private getFilterFormValue(fileSearchFilter: any) {
    let {
      filter_statusId,
      filter_clientId,
      ...filterFormValue
    } = fileSearchFilter;
    if (!!filter_clientId) {
      this.clientsService
        .getClientById(+filter_clientId)
        .pipe(
          map((client) => [client]),
          catchError(() => of([]))
        )
        .subscribe((clients) => this.selectedClient$.next(clients));
      filterFormValue = {
        ...filterFormValue,
        filter_clientId: +filter_clientId,
      };
    }

    if (!!filter_statusId) {
      filterFormValue = {
        ...filterFormValue,
        filter_statusId: +filter_statusId,
      };
    }

    return filterFormValue;
  }

  private refreshScreenData(searchFilter: SearchFilter = {}): void {
    this.fileSearchFilter = { ...this.fileSearchFilter, ...searchFilter };
    this.getFileData(this.fileSearchFilter);
  }

  private getFileData(fileSearchFilter: SearchFilter = {}): void {
    this.fileService.getFiles(fileSearchFilter).subscribe(this.updateFilesData);
  }

  private updateFilesData = (files: Page<File>): void => {
    this.dataSource = new MatTableDataSource<File>(files.content);
    this.paginatorLength = files.totalElements;
    this.paginatorSize = files.size;
  };

  private getSelectsData(): void {
    this.loadFileStatus();
    this.loadClients();
  }

  private loadFileStatus(): void {
    this.fileStatus$ = this.fileStatusService
      .getStatus()
      .pipe(map((page) => page.content));
  }

  private loadClients(): void {
    this.clients$ = merge(
      this.selectedClient$.asObservable(),
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

  private fileFilterFormValueChangesSubscribe(): void {
    this.fileFilterForm.valueChanges
      .pipe(debounceTime(400), map(this.createSearchFilter))
      .subscribe((searchFilter) => this.refreshScreenData(searchFilter));
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

  private getSearchFilterNullableValue(value: any) {
    return value ?? '';
  }

  public isBookedBlue(file: File): boolean {
    return file?.status?.code === FileStatusCode.BLUE_BOOKED;
  }

  public isBookedGreen(file: File): boolean {
    return file?.status?.code === FileStatusCode.GREEN_BOOKED;
  }

  public goToDetail(file: File): void {
    this.router.navigate(['files', file.id], {
      queryParams: this.fileSearchFilter,
    });
  }

  public onSortFiles(sort: Sort): void {
    this.refreshScreenData({
      sort: `${sort.active.replace('-', '.')},${sort.direction}`,
    });
  }

  public onPage(pageEvent: PageEvent): void {
    this.refreshScreenData({
      page: pageEvent.pageIndex.toString(),
      size: pageEvent.pageSize.toString(),
    });
  }
}
