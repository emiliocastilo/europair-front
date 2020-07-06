import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RowDataModel } from '../../models/table/row-data.model';
import { ColumnHeaderModel } from '../../models/table/column-header.model';

import M from 'materialize-css';

@Component({
  selector: 'core-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  //INPUT EVENTS
  @Input() columnsHeader:Array<ColumnHeaderModel>;
  @Input() columnsData:Array<RowDataModel>;
  //HEADER OUTPUT EVENTS
  @Output() search:EventEmitter<string> = new EventEmitter();
  //COLUMN OUTPUT EVENTS
  @Output() selectedItem:EventEmitter<number> = new EventEmitter();
  @Output() switchChangesStatus:EventEmitter<any> = new EventEmitter();
  @Output() executeActionEmitter:EventEmitter<any> = new EventEmitter();
  public internalSelectedItem:number;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(){
    //var elems = document.querySelectorAll('.fixed-action-btn-0');
    //var instances = M.FloatingActionButton.init(elems, {
    //  direction: 'top'
    //});
    var elems = document.querySelectorAll('.actions-trigger');
    var instances = M.Dropdown.init(elems, {});
  }

  ngOnChanges(){
  }

  public activate(selectedItem:number): void{
    this.selectedItem.emit(selectedItem);
    this.internalSelectedItem = selectedItem;
  }

  public changeStatus(event:any, id:string){
    this.switchChangesStatus.emit(
      {
        id: id,
        selectedItem: this.internalSelectedItem
      }
    );
  }

  public executeAction(id:string, selectedItem:number){
    this.executeActionEmitter.emit({
      actionId: id,
      selectedItem: selectedItem
    });
  }

}
