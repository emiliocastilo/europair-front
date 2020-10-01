import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import {
  FileRoute,
  DAYS_LIST,
  FrequencyDay,
} from '../../models/FileRoute.model';
import { FilesService } from '../../services/files.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FileRoutesService } from '../../services/file-routes.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Client, File, FileStatus } from '../../models/File.model';
import { FileStatusService } from '../../services/file-status.service';
import { ClientsService } from '../../services/clients.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class FileErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FileDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) expandedTable: MatTable<any>;

  public fileData: File;
  public routeData$: Observable<Data>;
  public pageTitle: string;

  public columnsToDisplay = [
    'label',
    'frequency',
    'initialDate',
    'endDate',
    'frequencyDays',
    'rotations.length',
    'seats',
    'periodDays',
    'dayNumber',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource();
  public expandedElements: FileRoute[] = [];
  public resultsLength = 0;
  public pageSize = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  public fileForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    description: ['', Validators.required],
    status: [''],
    client: [''],
  });

  public statusOptions$: Observable<FileStatus[]>;
  public clientOptions$: Observable<Client[]>;

  public matcher = new FileErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private fileService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fileRoutesService: FileRoutesService,
    private fileStatusService: FileStatusService,
    private clientService: ClientsService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.loadStatus();
    this.loadClients();
    this.routeData$ = this.route.data.pipe(tap(this.initFileData));
  }

  private loadStatus(): void {
    this.fileForm
      .get('status')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.statusOptions$ = term ? this.getFilteredStatus(term) : of([]);
      });
  }

  private loadClients(): void {
    this.fileForm
      .get('client')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        console.log(term);

        this.clientOptions$ = term ? this.getFilteredClients(term) : of([]);
      });
  }

  private getFilteredStatus(term: string): Observable<FileStatus[]> {
    const filter = {};
    return this.fileStatusService.getStatus(filter).pipe(
      map((page: Page<FileStatus>) => page.content),
      map((response) =>
        response.filter((p) => {
          return (
            p.code.toUpperCase().includes(term.toUpperCase()) ||
            p.name.toUpperCase().includes(term.toUpperCase())
          );
        })
      )
    );
  }

  private getFilteredClients(term: string): Observable<Client[]> {
    const filter = {};
    return this.clientService.getClients(filter).pipe(
      map((page: Page<Client>) => page.content),
      map((response) =>
        response.filter((p) => {
          return (
            p.code.toUpperCase().includes(term.toUpperCase()) ||
            p.name.toUpperCase().includes(term.toUpperCase())
          );
        })
      )
    );
  }

  public getChildRoutes(fileRoute: FileRoute): MatTableDataSource<FileRoute> {
    return new MatTableDataSource(fileRoute.rotations);
  }

  public initFileData = ({ isFileDetail }): void => {
    if (isFileDetail) {
      this.route.params
        .pipe(
          switchMap((params: Params) =>
            this.fileService.getFileById(params.fileId)
          )
        )
        .subscribe((file: File) => {
          this.getFileData(file);
        });
    }
  };

  // TODO: fix general data inputs
  private getFileData(file: File): void {
    this.fileData = file;
    this.fileForm.patchValue({
      ...file,
      status: file.status.name,
      client: file.client.name,
    });

    this.fileRoutesService
      .getFileRoutes(file.id)
      .subscribe((data: Page<FileRoute>) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
        this.resultsLength = data.totalElements;
        this.pageSize = data.size;
      });
  }

  public onSaveFile(update: boolean) {
    if (this.fileForm.valid) {
      this.fileData = {
        ...this.fileData,
        ...this.fileForm.value,
      };

      console.log('SAVING FILE', this.fileData);

      this.fileService.saveFile(this.fileData).subscribe(() => {
        if (!update) {
          this.router.navigate([`/files/${this.fileData.id}`]);
        } else {
          this.getFileData(this.fileData);
        }
      });
    }
  }

  public getRotationNumber(
    parentRoute: FileRoute,
    rotation: FileRoute
  ): string {
    const index = parentRoute.rotations.indexOf(rotation);
    return index === -1 ? '' : `${index + 1}`;
  }

  public getFormattedFrequency(frequencyDays: FrequencyDay[]): string {
    if (!frequencyDays) {
      return '';
    }
    const formattedWeek = [];
    const frequency = frequencyDays.map((elm) => elm.weekday);

    this.translateService
      .get('DAYS.ABBREVIATION')
      .subscribe((data: Array<string>) => {
        DAYS_LIST.forEach((dayName) => {
          formattedWeek.push(frequency.includes(dayName) ? data[dayName] : '-');
        });
      });
    return formattedWeek.join(' ');
  }

  public runAction(
    event: Event,
    isPlane: boolean = false,
    id: number = 0
  ): void {
    event.preventDefault();
    event.stopPropagation();
    if (isPlane) {
      this.router.navigate(['/files/search/aircraft'], {
        queryParams: { routeId: id },
      });
    }
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.fileForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.fileForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public expandRow(element: FileRoute) {
    const index: number = this.expandedElements.indexOf(element);
    index !== -1
      ? this.expandedElements.splice(index, 1)
      : this.expandedElements.push(element);
    setTimeout(() => {
      this.expandedTable.updateStickyColumnStyles();
    }, 1000);
  }
}
