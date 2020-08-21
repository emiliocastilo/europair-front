import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import {
  Certification,
  Operator,
} from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable()
export class AirportOperatorsTableAdapterService {
  constructor() {}

  public getCertifiedOperatorsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'operator-iatacode-header',
        'search',
        'Operador',
        new ColumnHeaderSizeModel('3', '3', '3'),
        'operator.iataCode'
      ),
      new ColumnHeaderModel(
        'operator-comment-header',
        'search',
        'Observación',
        new ColumnHeaderSizeModel('8', '8', '8'),
        'comment'
      ),
    ];
  }

  public getCertifiedOperatorsTableData(
    certifiedOperators: Certification[]
  ): RowDataModel[] {
    const operatorTableData: RowDataModel[] = new Array<RowDataModel>();
    certifiedOperators.forEach((certifiedOperator: Certification) => {
      const operatorRow: RowDataModel = new RowDataModel();
      operatorRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      operatorRow.pushColumn(
        new ColumnDataModel('text', this.getOperatorText(certifiedOperator.operator))
      );
      operatorRow.pushColumn(
        new ColumnDataModel('text', certifiedOperator.comments)
      );
      operatorTableData.push(operatorRow);
    });
    return operatorTableData;
  }

  private getOperatorText(operator: Operator): string {
    let text: string = '';
    if (operator) {
      text = `${operator.iataCode} - ${operator.icaoCode} - ${operator.name}`;
    }
    return text;
  }

  public getOperatorsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'operator-iata-header',
        'search',
        'IATA',
        new ColumnHeaderSizeModel('5', '3', '3'),
        'iataCode'
      ),
      new ColumnHeaderModel(
        'operator-icao-header',
        'search',
        'ICAO',
        new ColumnHeaderSizeModel('5', '3', '3'),
        'icaoCode'
      ),
      new ColumnHeaderModel(
        'operator-name-header',
        'search',
        'Nombre',
        new ColumnHeaderSizeModel('0', '5', '5'),
        'name'
      ),
    ];
  }

  public getOperatorsTableData(operators: Operator[]): RowDataModel[] {
    const operatorTableData: RowDataModel[] = new Array<RowDataModel>();
    operators.forEach((operator: Operator) => {
      const operatorRow: RowDataModel = new RowDataModel();
      operatorRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      operatorRow.pushColumn(new ColumnDataModel('text', operator.iataCode));
      operatorRow.pushColumn(new ColumnDataModel('text', operator.icaoCode));
      operatorRow.pushColumn(new ColumnDataModel('text', operator.name));
      operatorTableData.push(operatorRow);
    });
    return operatorTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
