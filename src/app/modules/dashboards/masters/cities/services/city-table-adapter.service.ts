import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { City } from '../models/city';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable()
export class CityTableAdapterService {
  constructor() { }

  public getCityColumnsHeader(): ColumnHeaderModel[] {
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
        'Code',
        new ColumnHeaderSizeModel('2', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Ciudad',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'País',
        new ColumnHeaderSizeModel('3', '3', '4')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
    ];
  }

  public getCityTableData(cities: Array<City>): Array<RowDataModel> {
    const cityTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    cities.forEach((city: City) => {
      const cityRow: RowDataModel = new RowDataModel();
      cityRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      cityRow.pushColumn(new ColumnDataModel('text', city.code));
      cityRow.pushColumn(new ColumnDataModel('text', city.name));
      cityRow.pushColumn(new ColumnDataModel('text', city.country.name));
      cityRow.pushColumn(new ColumnDataModel('actions', actions));
      cityRow.author = city.modifiedBy != null? city.modifiedBy : city.createdBy;
      cityRow.timestamp = city.modifiedAt != null? city.modifiedAt : city.createdAt;
      cityRow.modified = city.modifiedAt != null;
      cityTableData.push(cityRow);
    });
    return cityTableData;
  }

  public getPagination(){
    const clientPagination: boolean = true;
    const initPage: number = 1;
    const visiblePages: number = 4;
    const lastPage: number = 5;
    const elememtsPerpage: number = 20;
    return new PaginationModel(clientPagination, initPage, visiblePages, lastPage, elememtsPerpage);
  }
}
