import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Condition } from './models/conditions';
import { ConditionsService } from './services/conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public conditions: Condition[];
  public conditionDetailTitle: string;

  public columnToDisplay = ['code', 'name', 'alias', 'conditionType', 'cmsCode', 'phoneNumber', 'mail'];
  public dataSource = new MatTableDataSource();
  public resultsLength: number = 0;
  public pageSize: number = 0;
  
  constructor(
    private readonly conditionsService: ConditionsService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initializeConditionsTable();
  }
  private initializeConditionsTable() {
    this.conditionsService.getConditions().subscribe((data: Page<Condition>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }

  public goToDetail(condition: Condition): void {
    this.router.navigate(['conditions', condition.id]);
  }
}
