import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { Observation } from '../../../../../models/airport';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Injectable()
export class AirportObservationsTableAdapterService {
  constructor() {}

  public getObservationsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'observation-observation-header',
        'search',
        'Observación',
        new ColumnHeaderSizeModel('11', '11', '11'),
        'observation'
      ),
    ];
  }

  public getObservationsTableData(observations: Observation[]): RowDataModel[] {
    const observationTableData: RowDataModel[] = new Array<RowDataModel>();
    observations.forEach((observation: Observation) => {
      const observationRow: RowDataModel = new RowDataModel();
      observationRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      observationRow.pushColumn(
        new ColumnDataModel('text', observation.observation)
      );
      observationTableData.push(observationRow);
    });
    return observationTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
