import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';

@Component({
  selector: 'core-table-column-actions',
  templateUrl: './column-actions.component.html',
  styleUrls: ['./column-actions.component.scss']
})
export class ColumnActionsComponent implements OnInit {
  @Input() prefix: string;
  @Input() rowDataIndex: number;
  @Input() actions:ColumnActionsModel;
  @Output() executeActionEmitter:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public executeAction(id:string, selectedItem:number){
    this.executeActionEmitter.emit({
      actionId: id,
      selectedItem: selectedItem
    });
  }

}
