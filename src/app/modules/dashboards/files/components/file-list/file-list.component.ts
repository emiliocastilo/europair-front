import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { File } from '../../models/File.model';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  public dataSource = new MatTableDataSource<File>();
  public displayedColumns = [
    'selection',
    'id',
    'description',
    'status.name',
    'client.name',
    'actions',
  ];
  public paginatorLength: number = 0;
  public paginatorSize: number = 0;
  private fileSearchFilter: SearchFilter = {};

  constructor(
    private readonly fileService: FilesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFileData();
  }

  private getFileData(fileSearchFilter: SearchFilter = {}) {
    this.fileService.getFiles(fileSearchFilter).subscribe(this.updateFilesData);
  }

  private updateFilesData = (files: Page<File>) => {
    this.dataSource = new MatTableDataSource<File>(files.content);
    this.paginatorLength = files.totalElements;
    this.paginatorSize = files.size;
  };

  public goToDetail(file: File) {
    console.log('GO TO DETAIL', file);
    this.router.navigate(['files', file.id]);
  }

  public removeFile(file: File) {
    console.log('REMOVE FILE', file);
  }

  public rowClicked(file: File) {
    console.log('ROW CLICKED', file);
  }

  public onSortFiles(sort: Sort) {
    console.log(sort);
  }

  public onPage(pageEvent: PageEvent) {
    this.fileSearchFilter['page'] = pageEvent.pageIndex.toString();
    this.fileSearchFilter['size'] = pageEvent.pageSize.toString();
    this.getFileData(this.fileSearchFilter);
  }
}
