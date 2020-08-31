import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';

@Component({
  selector: 'core-letter-table',
  templateUrl: './letter-table.component.html',
  styleUrls: ['./letter-table.component.scss']
})
export class LetterTableComponent implements OnInit {
  @Input() columnsHeader:Array<ColumnHeaderModel>;
  @Input() columnsData:Array<RowDataModel>;
  @Input() internalSelectedItems: number[] = [];
  @Output() selectedValue:EventEmitter<any> = new EventEmitter();
  @Output() executeActionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() switchChangesStatus: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onSelectedValue(event:any){
    this.selectedValue.emit(event);
  }

  public executeAction(id: string, selectedItem: number) {
    this.executeActionEmitter.emit({
      actionId: id,
      selectedItem: selectedItem,
    });
  }

  public changeStatus(id: string, rowDataIndex: number) {
    this.switchChangesStatus.emit({
      id: id,
      selectedItem: rowDataIndex,
    });
  }

  public isRowSelected(rowIndex: number): boolean {
    return this.internalSelectedItems[rowIndex] !== undefined;
  }
}
