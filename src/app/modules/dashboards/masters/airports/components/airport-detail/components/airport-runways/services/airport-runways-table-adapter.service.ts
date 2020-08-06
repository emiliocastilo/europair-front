import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Track } from '../../../../../models/airport';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { Measure } from 'src/app/core/models/base/measure';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable()
export class AirportRunwaysTableAdapterService {
  constructor() {}

  public getRunwaysColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'name-header',
        'text',
        'Pista',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'main-runway-header',
        'text',
        'Principal',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'long-header',
        'text',
        'Largo',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'width-header',
        'text',
        'Ancho',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'observation-header',
        'text',
        'Observaciones',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
    ];
  }

  public getRunwaysTableData(runways: Track[]): RowDataModel[] {
    const runwayTableData: RowDataModel[] = new Array<RowDataModel>();
    runways.forEach((runway: Track) => {
      const runwayRow: RowDataModel = new RowDataModel();
      runwayRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      runwayRow.pushColumn(new ColumnDataModel('text', runway.name));
      runwayRow.pushColumn(
        new ColumnDataModel('switch', {
          id: 'runway-' + runway.id,
          check: runway.main ?? false,
          disable: true,
        })
      );
      runwayRow.pushColumn(
        new ColumnDataModel('text', this.formatMeasureData(runway.length))
      );
      runwayRow.pushColumn(
        new ColumnDataModel('text', this.formatMeasureData(runway.width))
      );
      runwayRow.pushColumn(new ColumnDataModel('text', runway.observation));
      runwayTableData.push(runwayRow);
    });
    return runwayTableData;
  }

  private formatMeasureData(measure: Measure): string {
    return (measure?.value ?? '') + (measure?.type ?? '');
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
