import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
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

  public columnToDisplay = ['code', 'name', 'type', 'actions'];
  public dataSource = new MatTableDataSource();
  public resultsLength: number = 0;
  public pageSize: number = 0;
  
  constructor(
    private readonly servicesService: ServicesService,
    private readonly router: Router,
    private readonly matDialog: MatDialog
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

  public deleteService(service: Services) {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'SERVICES.CONFIRM_DELETE',
          message: 'SERVICES.MSG_DELETE_SERVICE',
          translationParams: {
            name: service.name,
          },
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicesService.deleteServices(service).subscribe(() => this.initializeServicesTable());
      }
    });
  }

  public goToDetail(service: Services): void {
    this.router.navigate(['services', service.id]);
  }
}
