import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Region } from 'src/app/modules/dashboards/masters/regions/models/region';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class AirportRegionsTableAdapterService {
  constructor() {}

  public getRegionsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'region-code-header',
        'search',
        'Código',
        new ColumnHeaderSizeModel('3', '3', '3'),
        'code'
      ),
      new ColumnHeaderModel(
        'region-name-header',
        'search',
        'Región',
        new ColumnHeaderSizeModel('8', '8', '8'),
        'name'
      ),
    ];
  }

  public getRegionsEditorColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'region-editor-code-header',
        'search',
        'Código',
        new ColumnHeaderSizeModel('4', '4', '4'),
        'code'
      ),
      new ColumnHeaderModel(
        'region-editor-name-header',
        'search',
        'Región',
        new ColumnHeaderSizeModel('7', '7', '7'),
        'name'
      ),
    ];
  }

  public getRegionsTableData(regions: Region[]): RowDataModel[] {
    const regionTableData: RowDataModel[] = new Array<RowDataModel>();
    regions.forEach((region: Region) => {
      const regionRow: RowDataModel = new RowDataModel();
      regionRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      regionRow.pushColumn(new ColumnDataModel('text', region.code));
      regionRow.pushColumn(new ColumnDataModel('text', region.name));
      regionTableData.push(regionRow);
    });
    return regionTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
