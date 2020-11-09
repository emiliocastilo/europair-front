import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Region } from '../models/region';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class RegionsTableAdapterService {
  constructor() {}

  public getRegionColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'region-code-header',
        'text',
        'REGIONS.CODE',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
      new ColumnHeaderModel(
        'region-name-header',
        'text',
        'REGIONS.NAME',
        new ColumnHeaderSizeModel('6', '6', '6')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
    ];
  }

  public getRegionTableDataFromRegions(regions: Region[]): RowDataModel[] {
    const regionTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'REGION.EDIT', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'REGION.DELETE', 'red'));
    regions.forEach((region: Region) => {
      const regionRow: RowDataModel = new RowDataModel();
      regionRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      regionRow.pushColumn(new ColumnDataModel('text', region.code));
      regionRow.pushColumn(new ColumnDataModel('text', region.name));
      regionRow.pushColumn(new ColumnDataModel('actions', actions));
      regionTableData.push(regionRow);
    });
    return regionTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
