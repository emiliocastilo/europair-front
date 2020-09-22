import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    status: ['', Validators.required],
    client: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private fileService: FilesService,
    private router: Router,
    private translateService: TranslateService,
    private fileRoutesService: FileRoutesService
  ) {}

  ngAfterViewInit(): void {
    this.fileRoutesService
      .getFileRoutes(1)
      .subscribe((data: Page<FileRoute>) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
        this.resultsLength = data.totalElements;
        this.pageSize = data.size;
      });
  }

  ngOnInit(): void {
    this.getFormattedFrequency([]);
  }

  public getChildRoutes(fileRoute: FileRoute): MatTableDataSource<FileRoute> {
    return new MatTableDataSource(fileRoute.rotations);
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
        DAYS_LIST.forEach((dayName, dayNumber: any) => {
          formattedWeek.push(
            frequency.includes(dayNumber) ? data[dayName] : '-'
          );
        });
      });
    return formattedWeek.join(' ');
  }

  public runAction(event: Event, isPlane: boolean = false): void {
    event.preventDefault();
    event.stopPropagation();
    if (isPlane) {
      this.router.navigate(['/files/search/aircraft']);
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
