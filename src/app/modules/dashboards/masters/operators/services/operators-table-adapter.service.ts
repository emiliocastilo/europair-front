import { Injectable, OnDestroy } from '@angular/core';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import {
  Operator,
  Certification,
  OperatorComment,
} from '../models/Operator.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
@Injectable()
export class OperatorsTableAdapterService {
  constructor() {}

  public getOperatorColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'iata-header',
        'text',
        'IATA',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'icao-header',
        'text',
        'ICAO',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'name-header',
        'text',
        'Name',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
      new ColumnHeaderModel(
        'revision-header',
        'text',
        'Revision AOC',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
    ];
  }

  public getOperatorCertificationsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'Aeropuerto',
        new ColumnHeaderSizeModel('9', '7', '7')
      ),
      new ColumnHeaderModel(
        'observations-header',
        'text',
        'Observaciones',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getOperatorObservationsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'observation-header',
        'text',
        'Observaciones',
        new ColumnHeaderSizeModel('11', '11', '11')
      ),
    ];
  }

  public getOperatorTableDataFromOperators(
    operators: Operator[]
  ): RowDataModel[] {
    const operatorTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    operators.forEach((operator: Operator) => {
      const operatorRow: RowDataModel = new RowDataModel();
      operatorRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      operatorRow.pushColumn(new ColumnDataModel('text', operator.iataCode));
      operatorRow.pushColumn(new ColumnDataModel('text', operator.icaoCode));
      operatorRow.pushColumn(new ColumnDataModel('text', operator.name));
      operatorRow.pushColumn(
        new ColumnDataModel('text', operator.aocLastRevisionDate)
      );
      operatorRow.pushColumn(new ColumnDataModel('actions', actions));
      operatorRow.author =
        operator.modifiedBy != null ? operator.modifiedBy : operator.createdBy;
      operatorRow.timestamp =
        operator.modifiedAt != null ? operator.modifiedAt : operator.createdAt;
      operatorRow.modified = operator.modifiedAt != null;
      operatorTableData.push(operatorRow);
    });
    return operatorTableData;
  }

  public getCertificationTableData(
    certifications: Certification[]
  ): RowDataModel[] {
    const certificationTableData: Array<RowDataModel> = new Array<
      RowDataModel
    >();
    certifications.forEach((certification: Certification) => {
      const certificationRow: RowDataModel = new RowDataModel();
      certificationRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      certificationRow.pushColumn(
        new ColumnDataModel('text', certification.airport)
      );
      certificationRow.pushColumn(
        new ColumnDataModel('text', certification.comments)
      );
      certificationTableData.push(certificationRow);
    });
    return certificationTableData;
  }

  public getOperatorObservationsTableData(observations: any[]): RowDataModel[] {
    const observationsTableData: Array<RowDataModel> = new Array<
      RowDataModel
    >();
    observations.forEach((observation: OperatorComment) => {
      const observationRow: RowDataModel = new RowDataModel();
      observationRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      observationRow.pushColumn(
        new ColumnDataModel('text', observation.comment)
      );
      observationsTableData.push(observationRow);
    });
    return observationsTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
