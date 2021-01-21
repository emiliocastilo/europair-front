import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { BehaviorSubject, concat, merge, Observable, of, Subject } from 'rxjs';
import {
  audit,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BaseAudit, RevType, AuditChanges } from 'src/app/core/models/audit/base-audit';
import { Page } from 'src/app/core/models/table/pagination/page';
import { User } from '../../../masters/users/models/user';
import { UsersService } from '../../../masters/users/services/users.service';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-file-audit',
  templateUrl: './file-audit.component.html',
  styleUrls: ['./file-audit.component.scss'],
})
export class FileAuditComponent implements OnInit {

  private fileId: number;

  // Table Properties
  public dataSource = new MatTableDataSource<BaseAudit>();
  public displayedColumns = [
    'rev-type',
    'datetime',
    'user',
    'changes'
  ];
  public revTypeSelect = [
    'ADD',
    'UPDATE',
    'DELETE'
  ];

  public paginatorLength: number = 0;
  public paginatorSize: number = 0;
  private fileAuditData: BaseAudit[];
  public users$: Observable<User[]>;
  public usersInput$ = new Subject<string>();
  public usersLoading = false;
  private selectedUsers$ = new BehaviorSubject<User[]>([]);

  public auditFilterForm: FormGroup = this.fb.group({
    filter_user: [''],
    filter_revType: [''],
    filter_startDate: [''],
    filter_endDate: [''],
    filter_changes: ['']
  });

  constructor(
    private readonly fileService: FilesService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,

    // Table only services
    private readonly usersService: UsersService
  ) { }

  ngOnInit(): void {
    // Table functions
    this.loadUsers();
    this.auditFilterFormValueChangesSubscribe();


    this.obtainParams();
  }



  private obtainParams(): void {
    this.route.params.subscribe((params: { fileId: string }) => {
      this.fileId = parseInt(params.fileId, 10);
      this.getAuditData(this.fileId);
    });
  }

  public getAuditData(fileId: number): void {
    this.fileService.getFileAudit(fileId).subscribe((auditData: BaseAudit[]) => {
      this.fileAuditData = auditData;
      this.updateTableData(auditData);
    });
  };

  public returnToFileList() {
    // Remove file-detail related queryparams before navigate to file list
    this.router.navigate(['files'], {
      queryParams: { ...this.route.snapshot.queryParams, expandedQuote: null },
      queryParamsHandling: 'merge'
    });
  }


  // Table functions start

  private loadUsers(): void {
    this.users$ = merge(
      this.selectedUsers$.asObservable(),
      this.usersInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.usersLoading = true)),
        switchMap(
          (term: string): Observable<User[]> =>
            this.usersService.getUsers({
              filter_username: term,
              filter_internalUser: 'true'
            }).pipe(
              map((page: Page<User>) => page.content),
              catchError(() => of([])), // empty list on error
              tap(() => (this.usersLoading = false))
            )
        )
      )
    );
  }

  private updateTableData = (fileAudit: BaseAudit[]): void => {
    this.dataSource = new MatTableDataSource<BaseAudit>(fileAudit);
  };

  public auditMatchesFilter(auditData: BaseAudit): boolean {
    let dataMatch = true;

    const userFilter: string = this.auditFilterForm.get('filter_user').value;
    if (userFilter) {
      dataMatch = dataMatch && auditData.user.includes(userFilter);
    }

    const startDateFilter: Date = this.auditFilterForm.get('filter_startDate').value;
    const endDateFilter: Date = this.auditFilterForm.get('filter_endDate').value;
    if (startDateFilter && endDateFilter) {
      dataMatch = dataMatch &&
        (auditData.datetime.getTime() >= startDateFilter.getTime() && auditData.datetime.getTime() <= endDateFilter.getTime());
    } else if (startDateFilter) {
      dataMatch = dataMatch && auditData.datetime.getTime() >= startDateFilter.getTime();
    } else if (endDateFilter) {
      dataMatch = dataMatch && auditData.datetime.getTime() <= endDateFilter.getTime();
    }

    const revTypeFilter: RevType = this.auditFilterForm.get('filter_revType').value;
    if (revTypeFilter) {
      dataMatch = dataMatch && auditData.revType === revTypeFilter;
    }

    const changesFilter: string = this.auditFilterForm.get('filter_changes').value;
    if (changesFilter) {
      const auditChanges: AuditChanges[] = auditData.changes ? auditData.changes : [];
      dataMatch = dataMatch && (auditChanges.some(c => c.propertyName.includes(changesFilter) ||
        (c.oldValue && c.oldValue.includes(changesFilter)) || (c.newValue && c.newValue.includes(changesFilter))
      ));
    }

    return dataMatch;
  }

  private filterAuditData(): void {
    if (this.fileAuditData) {
      const filteredData = this.fileAuditData.filter((auditData: BaseAudit) => this.auditMatchesFilter(auditData));
      this.updateTableData(filteredData);
    }
  };

  private auditFilterFormValueChangesSubscribe(): void {
    this.auditFilterForm.valueChanges
      .pipe(debounceTime(400))
      //.pipe(debounceTime(400), map(this.createSearchFilter))
      //.subscribe((searchFilter) => this.refreshScreenData(searchFilter));
      .subscribe(() => this.filterAuditData());
  }

  // Table functions end


  public onSort(sort?: Sort): void {
    /*
    this.refreshScreenData({
      sort: `${sort.active.replace('-', '.')},${sort.direction}`,
    });
    */
  }

  public onPage(pageEvent: PageEvent): void {
    /*
    this.refreshScreenData({
      page: pageEvent.pageIndex.toString(),
      size: pageEvent.pageSize.toString(),
    });
    */
  }

}
