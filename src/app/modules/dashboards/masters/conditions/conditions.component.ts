import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Condition } from './models/conditions';
import { ConditionsService } from './services/conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent implements OnInit {
  public conditions: Condition[];
  public conditionDetailTitle: string;

  public columnToDisplay = ['code', 'title', 'description', 'conditionOrder', 'actions'];
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
  private initializeConditionsTable(searchFilter?: SearchFilter) {
    this.conditionsService.getConditions(searchFilter).subscribe((data: Page<Condition>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }

  public deleteCondition(condition: Condition): void {
    this.conditionsService.removeCondition(condition).subscribe(() => this.initializeConditionsTable());
  }

  public goToDetail(condition: Condition): void {
    this.router.navigate(['conditions', condition.id]);
  }

  public onPage(pageEvent: PageEvent): void {
    this.initializeConditionsTable({
      page: pageEvent.pageIndex.toString(),
      size: pageEvent.pageSize.toString(),
    });
  }

  public onSort(sortOrder: Sort) {
    this.initializeConditionsTable({
      sort: sortOrder.active + ',' + sortOrder.direction,
    });
  }
}
