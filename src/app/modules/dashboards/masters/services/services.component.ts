import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Services } from './models/services.model';
import { ServicesService } from './services/services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public services: Services[];
  public serviceDetailTitle: string;

  public columnToDisplay = ['code', 'name', 'type'];
  public dataSource = new MatTableDataSource();
  public resultsLength: number = 0;
  public pageSize: number = 0;
  
  constructor(
    private readonly servicesService: ServicesService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initializeServicesTable();
  }

  private initializeServicesTable() {
    this.servicesService.getServices().subscribe((data: Page<Services>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }

  public createService(): void {
    this.router.navigate(['services', 'new']);
  }

  public goToDetail(service: Services): void {
    this.router.navigate(['services', service.id]);
  }
}
