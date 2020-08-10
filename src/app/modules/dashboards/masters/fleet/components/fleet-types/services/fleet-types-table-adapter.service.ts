import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { FleetType } from '../../../models/fleet';

@Injectable({
  providedIn: 'root',
})
export class FleetTypesTableAdapterService {
  constructor() {}

  public getFleetTypeColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Código',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Descripción',
        new ColumnHeaderSizeModel('1', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Categoría',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Subcategoría',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Rango de vuelo',
        new ColumnHeaderSizeModel('2', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Unidad',
        new ColumnHeaderSizeModel('2', '1', '1')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '2')
      ),
    ];
  }

  public getFleetTypes(fleetTypes: Array<FleetType>): RowDataModel[] {
    const fleetTypeTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    fleetTypes.forEach((fleetType: FleetType) => {
      const fleetTypeRow: RowDataModel = new RowDataModel();
      fleetTypeRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.code));
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.description));
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.category.name));
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.subcategory.name));
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.flightRange.value));
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.flightRange.type));
      fleetTypeRow.pushColumn(new ColumnDataModel('actions', actions));
      fleetTypeRow.setAuditParams(fleetType);
      fleetTypeTableData.push(fleetTypeRow);
    });
    return fleetTypeTableData;
  }

  public getPagination(){
    const clientPagination: boolean = true;
    const initPage: number = 1;
    const visiblePages: number = 4;
    const lastPage: number = 5;
    const elementsPerPage: number = 8;
    return new PaginationModel(clientPagination, initPage, visiblePages, lastPage, elementsPerPage);
  }
}
