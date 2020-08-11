import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Terminal } from '../../../../../models/airport';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';

@Injectable()
export class AirportTerminalsTableAdapterService {
  constructor() {}

  public getTerminalsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'terminal-code-header',
        'search',
        'Código',
        new ColumnHeaderSizeModel('3', '3', '3'),
        'code'
      ),
      new ColumnHeaderModel(
        'terminal-name-header',
        'search',
        'Nombre',
        new ColumnHeaderSizeModel('8', '4', '4'),
        'name'
      ),
      new ColumnHeaderModel(
        'terminal-observation-header',
        'search',
        'Observaciones',
        new ColumnHeaderSizeModel('0', '4', '4'),
        'observation'
      ),
    ];
  }

  public getTerminalsTableData(terminals: Terminal[]): RowDataModel[] {
    const terminalTableData: RowDataModel[] = new Array<RowDataModel>();
    terminals.forEach((terminal: Terminal) => {
      const terminalRow: RowDataModel = new RowDataModel();
      terminalRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      terminalRow.pushColumn(new ColumnDataModel('text', terminal.code));
      terminalRow.pushColumn(new ColumnDataModel('text', terminal.name));
      terminalRow.pushColumn(new ColumnDataModel('text', terminal.observation));
      terminalTableData.push(terminalRow);
    });
    return terminalTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
