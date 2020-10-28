import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { File, FileStatusCode } from '../../models/File.model';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-flight-tracking',
  templateUrl: './flight-tracking.component.html',
  styleUrls: ['./flight-tracking.component.scss'],
})
export class FlightTrackingComponent implements OnInit {
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

  public isBookedBlue(file: File): boolean {
    return file.status?.code === FileStatusCode.BLUE_BOOKED;
  }

  public isBookedGreen(file: File): boolean {
    return file.status?.code === FileStatusCode.GREEN_BOOKED;
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
