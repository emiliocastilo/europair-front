import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RowDataModel } from '../../models/table/row-data.model';
import { ColumnHeaderModel } from '../../models/table/column-header.model';
import { PaginationModel } from '../../models/table/pagination/pagination.model';
import { InputTextIcon, InputTextIconPositions } from '../../models/basic/input-text/input-text-icon';
import { ColumnFilter } from '../../models/table/columns/column-filter';
import { SortByColumn } from '../../models/table/sort-button/sort-by-column';
@Component({
  selector: 'core-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  //INPUT EVENTS
  @Input() columnsHeader: Array<ColumnHeaderModel>;
  @Input() columnsData: Array<RowDataModel>;
  @Input() pagination:PaginationModel;
  //HEADER OUTPUT EVENTS
  @Output() search: EventEmitter<ColumnFilter> = new EventEmitter();
  //COLUMN OUTPUT EVENTS
  @Output() selectedItem: EventEmitter<number> = new EventEmitter();
  @Output() switchChangesStatus: EventEmitter<any> = new EventEmitter();
  @Output() executeActionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() changePage: EventEmitter<number> = new EventEmitter();
  @Output() sortByColumn: EventEmitter<SortByColumn> = new EventEmitter();
  public internalSelectedItem: number;
  public columnsDataToShow: Array<RowDataModel>;
  public lastPage:number;
  public iconConfig: InputTextIcon;
  public sortingByColumn: any  = {};

  constructor() {}

  ngOnInit(): void { 
    this.iconConfig = {icon: 'search', position: InputTextIconPositions.PREFIX}
   }

  ngAfterViewInit(): void {
    var letterElems = document.querySelectorAll('a[id^=letter-actions-');
    M.Dropdown.init(letterElems, {});
    var tableElems = document.querySelectorAll('a[id^=desktop-table-actions-');
    M.Dropdown.init(tableElems, {});
  }

  ngOnChanges(): void {
    if(this.pagination){
      this.lastPage = this.pagination.initPage;
      this.onChangePage(this.pagination.initPage);
    } else{
      this.onChangePage(1);
    }
   }

  public activate(selectedItem: number): void {
    if(this.pagination.clientPagination){
      this.selectedItem
      .emit(this.calculateSelectedItem(selectedItem));
    } else{
      this.selectedItem
      .emit(selectedItem);
    }
    this.internalSelectedItem = selectedItem;
  }

  public changeStatus(event: any, id: string) {
    this.switchChangesStatus.emit({
      id: id,
      selectedItem: this.internalSelectedItem,
    });
  }

  public executeAction(id: string, selectedItem: number) {
    this.executeActionEmitter.emit({
      actionId: id,
      selectedItem: this.calculateSelectedItem(selectedItem),
    });
  }

  public onChangePage(selectedPage:number){
    if(this.pagination){
      this.lastPage = selectedPage;
      if(this.pagination.clientPagination){
        if(selectedPage == 1){
          this.columnsDataToShow = this.columnsData.slice
          (0, this.pagination.elememtsPerpage);
        } else{
          let cutUpperLimit = selectedPage*this.pagination.elememtsPerpage;
          this.columnsDataToShow = this.columnsData.slice
          (cutUpperLimit-this.pagination.elememtsPerpage, cutUpperLimit);
        }
      } else{
        this.changePage.emit(selectedPage-1);
      }
    }
  }

  private calculateSelectedItem(selectedItem:number):number {
    if(this.pagination.clientPagination){
      return ((this.lastPage-1) * this.pagination.elememtsPerpage)
      + selectedItem;
    } else{
      return selectedItem;
    }
  }

  public onSearchHeaderChanged(searchTerm: string, identifier: string): void {
    this.search.next({searchTerm, identifier});
  }

  public onSortByColumn(sort: SortByColumn): void {
    this.sortingByColumn = {};
    this.sortingByColumn[sort.column] = sort.order;
    this.sortByColumn.next(sort);
  }
}
