import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Country } from '../models/country';

@Injectable()
export class CountryTableAdapterService {
  constructor() { }

  public getCountryColumnsHeader(): ColumnHeaderModel[] {
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
        'País',
        new ColumnHeaderSizeModel('7', '7', '8')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
    ];
  }

  public getCountryTableData(countries: Array<Country>): Array<RowDataModel> {
    const countryTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    countries.forEach((country: Country) => {
      const countryRow: RowDataModel = new RowDataModel();
      countryRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      countryRow.pushColumn(new ColumnDataModel('text', country.code));
      countryRow.pushColumn(new ColumnDataModel('text', country.name));
      countryRow.pushColumn(new ColumnDataModel('actions', actions));
      countryTableData.push(countryRow);
    });
    return countryTableData;
  }
}
