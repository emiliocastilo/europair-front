import { Component, OnInit } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';

@Component({
  selector: 'app-example-table',
  templateUrl: './example-table.component.html',
  styleUrls: ['./example-table.component.scss']
})
export class ExampleTableComponent implements OnInit {
  public columnsHeader:Array<ColumnHeaderModel> = [
    new ColumnHeaderModel('selector-header', 'text','', '2'),
    new ColumnHeaderModel('user-header', 'text','Usuario', '3'),
    new ColumnHeaderModel('date-header','text','Fecha', '3'),
    new ColumnHeaderModel('hour-header', 'text','Hora', '2'),
    new ColumnHeaderModel('actions-header','text', '', '2')
  ];
  public columnsData:Array<RowDataModel> = [];

  constructor() { }

  ngOnInit(): void {
    this.columnsData = this.getTableData();
  }

  private getTableData():Array<RowDataModel>{
    let tableDataDummy:Array<RowDataModel> = new Array<RowDataModel>();
    let dummyRowOne:RowDataModel = new RowDataModel();
    dummyRowOne.pushColumn(new ColumnDataModel('checkbox'
    , new ColumnCheckboxModel('IDN00001', '/table')));
    dummyRowOne.pushColumn(new ColumnDataModel('text', 'jorgesfe'));
    dummyRowOne.pushColumn(new ColumnDataModel('text', '17/06/2020'));
    dummyRowOne.pushColumn(new ColumnDataModel('text', '14:23'));
    dummyRowOne.pushColumn(new ColumnDataModel('actions', 'jejej'));
    let dummyRowTwo:RowDataModel = new RowDataModel();
    dummyRowTwo.pushColumn(new ColumnDataModel('checkbox'
    , new ColumnCheckboxModel('IDN00002', '/table')));
    dummyRowTwo.pushColumn(new ColumnDataModel('text', 'alejandrarr'));
    dummyRowTwo.pushColumn(new ColumnDataModel('text', '17/06/2020'));
    dummyRowTwo.pushColumn(new ColumnDataModel('text', '14:30'));
    dummyRowTwo.pushColumn(new ColumnDataModel('actions', 'jejej'));
    let dummyRowThree:RowDataModel = new RowDataModel();
    dummyRowThree.pushColumn(new ColumnDataModel('checkbox'
    , new ColumnCheckboxModel('IDN00003', '/table')));
    dummyRowThree.pushColumn(new ColumnDataModel('text', 'jessicafp'));
    dummyRowThree.pushColumn(new ColumnDataModel('text', '17/06/2020'));
    dummyRowThree.pushColumn(new ColumnDataModel('text', '15:43'));
    dummyRowThree.pushColumn(new ColumnDataModel('actions', 'jejej'));
    tableDataDummy.push(dummyRowOne);
    tableDataDummy.push(dummyRowTwo);
    tableDataDummy.push(dummyRowThree);
    return tableDataDummy;
  }
}
