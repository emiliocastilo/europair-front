import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RowDataModel } from '../../models/table/row-data.model';
import { ColumnHeaderModel } from '../../models/table/column-header.model';
@Component({
  selector: 'core-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  //INPUT EVENTS
  @Input() columnsHeader: Array<ColumnHeaderModel>;
  @Input() columnsData: Array<RowDataModel>;
  //HEADER OUTPUT EVENTS
  @Output() search: EventEmitter<string> = new EventEmitter();
  //COLUMN OUTPUT EVENTS
  @Output() selectedItem: EventEmitter<number> = new EventEmitter();
  @Output() switchChangesStatus: EventEmitter<any> = new EventEmitter();
  @Output() executeActionEmitter: EventEmitter<any> = new EventEmitter();
  public internalSelectedItem: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    var letterElems = document.querySelectorAll('a[id^=letter-actions-');
    M.Dropdown.init(letterElems, {});
    var tableElems = document.querySelectorAll('a[id^=desktop-table-actions-');
    M.Dropdown.init(tableElems, {});
  }

  public activate(selectedItem: number): void {
    this.selectedItem.emit(selectedItem);
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
      selectedItem: selectedItem,
    });
  }
}
