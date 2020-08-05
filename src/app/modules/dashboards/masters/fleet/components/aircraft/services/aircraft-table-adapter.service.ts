import { Injectable } from '@angular/core';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Aircraft } from '../models/Aircraft.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftTableAdapterService {
  constructor() {}

  public getAircraftColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'operator-header',
        'text',
        'Operador',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      // new ColumnHeaderModel(
      //   'airport-header',
      //   'text',
      //   'Aeropuerto',
      //   new ColumnHeaderSizeModel('2', '2', '2')
      // ),
      new ColumnHeaderModel(
        'type-header',
        'text',
        'Tipo',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'enrollment-header',
        'text',
        'Matrícula',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'productionYear-header',
        'text',
        'Año de fabricación',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'quantity-header',
        'text',
        'Cantidad',
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

  // public getScreenColumnsHeader(): ColumnHeaderModel[] {
  //   return [
  //     new ColumnHeaderModel(
  //       'screen-header',
  //       'text',
  //       'Pantalla',
  //       new ColumnHeaderSizeModel('10', '8', '8')
  //     ),
  //     new ColumnHeaderModel(
  //       'assigned-header',
  //       'text',
  //       'Asignado',
  //       new ColumnHeaderSizeModel('2', '4', '4')
  //     ),
  //   ];
  // }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }

  public getAircraftTableDataFromAircraft(
    aircraft: Aircraft[]
  ): RowDataModel[] {
    const aircraftTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('visibility', 'view', 'Ver', 'green'));
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    aircraft.forEach((element: Aircraft) => {
      const aircraftRow: RowDataModel = new RowDataModel();
      aircraftRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      aircraftRow.pushColumn(new ColumnDataModel('text', element.operator));
      aircraftRow.pushColumn(new ColumnDataModel('text', element.type));
      aircraftRow.pushColumn(new ColumnDataModel('text', element.enrollment));
      aircraftRow.pushColumn(
        new ColumnDataModel('text', element.productionYear)
      );
      aircraftRow.pushColumn(new ColumnDataModel('text', element.quantity));
      aircraftRow.pushColumn(new ColumnDataModel('actions', actions));
      aircraftTableData.push(aircraftRow);
      aircraftRow.author =
        element.modifiedBy != null ? element.modifiedBy : element.createdBy;
      aircraftRow.timestamp =
        element.modifiedAt != null ? element.modifiedAt : element.createdAt;
      aircraftRow.modified = element.modifiedAt != null;
    });
    return aircraftTableData;
  }
}
