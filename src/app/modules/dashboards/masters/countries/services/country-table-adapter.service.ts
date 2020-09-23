import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Country } from '../models/country';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CountryTableAdapterService {
  constructor(private readonly translateService: TranslateService) { }

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
        'COUNTRIES.CODE',
        new ColumnHeaderSizeModel('2', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'COUNTRIES.COUNTRY',
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
    actions.push(new ColumnActionsModel(
      'create',
      'edit',
      'COUNTRIES.EDIT',
      'europair-icon-blue'
    ));
    actions.push(new ColumnActionsModel(
      'delete',
      'delete',
      'COUNTRIES.DELETE',
      'red'
    ));
    countries.forEach((country: Country) => {
      const countryRow: RowDataModel = new RowDataModel();
      countryRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      countryRow.pushColumn(new ColumnDataModel('text', country.code));
      countryRow.pushColumn(new ColumnDataModel('text', country.name));
      countryRow.pushColumn(new ColumnDataModel('actions', actions));
      countryRow.setAuditParams(country);
      countryTableData.push(countryRow);
    });
    return countryTableData;
  }

  public getPagination() {
    const clientPagination: boolean = true;
    const initPage: number = 1;
    const visiblePages: number = 4;
    const lastPage: number = 5;
    const elementsPerPage: number = 10;
    return new PaginationModel(clientPagination, initPage, visiblePages, lastPage, elementsPerPage);
  }
}
