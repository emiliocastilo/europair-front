import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  SortByColumn,
  SortOrder,
} from 'src/app/core/models/table/sort-button/sort-by-column';

@Component({
  selector: 'core-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss'],
})
export class SortButtonComponent implements OnInit {
  @Input()
  public sortOrder: SortOrder;
  @Input()
  public sortId: string;
  @Output()
  public sortByColumn: EventEmitter<SortByColumn> = new EventEmitter();
  public sortedColumn: any = {};
  public readonly SORT_ORDER = SortOrder;
  constructor() {}

  ngOnInit(): void {}

  public onClickSortByColumn(identifier: string, order: SortOrder): void {
    this.sortByColumn.next({ column: identifier, order: order });
  }
}
