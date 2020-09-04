import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileRoute } from '../../models/FileRoute.model';
import { FilesService } from '../../services/files.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FileDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  public columnsToDisplay = [
    { title: 'Rutas Petición', label: 'code' },
    { title: 'Frequencia', label: 'frequency' },
    { title: 'Fecha inicio (UTC)', label: 'initialDate' },
    { title: 'Fecha fin (UTC)', label: 'endDate' },
  ];

  public columnsProps: string[] = this.columnsToDisplay.map(
    (column) => column.label
  );

  public dataSource: MatTableDataSource<FileRoute>;
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

  constructor(private fb: FormBuilder, private fileService: FilesService) {}

  ngOnInit(): void {
    this.fileService.getFileRoutes(1).subscribe((data: Page<FileRoute>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
  }
}
