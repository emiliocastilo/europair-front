import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { RowDataModel } from '../../models/table/row-data.model';
import { ColumnHeaderModel } from '../../models/table/column-header.model';
import { PaginationModel } from '../../models/table/pagination/pagination.model';
import {
  InputTextIcon,
  InputTextIconPositions,
} from '../../models/basic/input-text/input-text-icon';
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
  @Input() pagination: PaginationModel;
  //HEADER OUTPUT EVENTS
  @Output() search: EventEmitter<ColumnFilter> = new EventEmitter();
  //COLUMN OUTPUT EVENTS
  @Output() selectedItem: EventEmitter<number> = new EventEmitter();
  @Output() selectedItems: EventEmitter<number[]> = new EventEmitter();
  @Output() switchChangesStatus: EventEmitter<any> = new EventEmitter();
  @Output() executeActionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() changePage: EventEmitter<number> = new EventEmitter();
  @Output() sortByColumn: EventEmitter<SortByColumn> = new EventEmitter();
  public internalSelectedItem: number;
  public internalSelectedItems: number[] = [];
  public columnsDataToShow: Array<RowDataModel>;
  public lastPage: number;
  public iconConfig: InputTextIcon;
  public sortingByColumn: any = {};

  constructor() { }

  ngOnInit(): void {
    this.iconConfig = {
      icon: 'search',
      position: InputTextIconPositions.PREFIX,
    };
  }

  ngOnChanges(changes: {pagination: SimpleChange, columnsData: SimpleChange}): void {
    if (changes.pagination) {
      if (this.pagination) {
        this.onChangePage(this.pagination.initPage);
      } else {
        this.onChangePage(1);
      }
    } else if (changes.columnsData && !this.pagination.clientPagination) {
      this.columnsDataToShow = this.columnsData;
    }
  }

  public activate(selectedItem: number): void {
    if (this.pagination.clientPagination) {
      this.selectedItem.emit(this.calculateSelectedItem(selectedItem));
    } else {
      this.selectedItem.emit(selectedItem);
    }
    this.internalSelectedItem = selectedItem;
    this.activateMultipleSelection(selectedItem);
  }

  private activateMultipleSelection(selectedItem: number): void {
    const selectedItemCalculated = this.calculateSelectedItem(selectedItem);
    if (this.internalSelectedItems[selectedItem] === undefined) {
      this.internalSelectedItems[selectedItem] = selectedItemCalculated;
    } else {
      this.internalSelectedItems[selectedItem] = undefined;
    }
    this.emitFilteredInternalSelectedItems(this.internalSelectedItems);
  }

  public isRowSelected(rowIndex: number): boolean {
    return this.internalSelectedItems[rowIndex] !== undefined;
  }

  public changeStatus(id: string, rowDataIndex: number) {
    this.switchChangesStatus.emit({
      id: id,
      selectedItem: rowDataIndex,
    });
  }

  public executeAction(id: string, selectedItem: number) {
    this.executeActionEmitter.emit({
      actionId: id,
      selectedItem: this.calculateSelectedItem(selectedItem),
    });
  }

  public onChangePage(selectedPage: number) {
    if (this.pagination) {
      this.lastPage = selectedPage;
      if (this.pagination.clientPagination) {
        if (selectedPage === 1) {
          this.columnsDataToShow = this.columnsData?.slice(0, this.pagination.elementsPerPage);
        } else {
          let cutUpperLimit = selectedPage * this.pagination.elementsPerPage;
          this.columnsDataToShow = this.columnsData?.slice(
            cutUpperLimit - this.pagination.elementsPerPage,
            cutUpperLimit
          );
        }
      } else {
        this.columnsDataToShow = this.columnsData;
        this.changePage.emit(selectedPage - 1);
      }
      this.internalSelectedItems = [];
      this.selectedItems.next([]);
    }
  }

  private calculateSelectedItem(selectedItem: number): number {
    if (this.pagination.clientPagination) {
      return (
        (this.lastPage - 1) * this.pagination.elementsPerPage + selectedItem
      );
    } else {
      return selectedItem;
    }
  }

  public onSelectAll(isSelectAll: boolean): void {
    isSelectAll ? this.selectAllRows() : this.unselectAllRows();
    this.emitFilteredInternalSelectedItems(this.internalSelectedItems);
  }

  private selectAllRows() {
    this.columnsDataToShow.forEach((value, index) => {
      this.internalSelectedItems[index] = this.calculateSelectedItem(index);
    });
  }

  private unselectAllRows() {
    this.internalSelectedItems = [];
  }

  private emitFilteredInternalSelectedItems(internalSelectedItems: number[]) {
    this.selectedItems.next(
      this.internalSelectedItems.filter(
        (selectedItem) => selectedItem !== undefined
      )
    );
  }

  public onSearchHeaderChanged(searchTerm: string, identifier: string): void {
    this.search.next({ searchTerm, identifier });
  }

  public onSortByColumn(sort: SortByColumn): void {
    this.sortingByColumn = {};
    this.sortingByColumn[sort.column] = sort.order;
    this.sortByColumn.next(sort);
  }
}
