import { Injectable } from '@angular/core';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Aircraft, AircraftBase } from '../models/Aircraft.model';
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
        'FLEET.AIRCRAFTS.OPERATOR',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      // new ColumnHeaderModel(
      //   'airport-header',
      //   'text',
      //   'Aeropuerto',
      //   new ColumnHeaderSizeModel('2', '2', '2')
      // ),
      new ColumnHeaderModel(
        'aircraftType-header',
        'text',
        'FLEET.AIRCRAFTS.TYPE',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'plateNumber-header',
        'text',
        'FLEET.AIRCRAFTS.PLATE_NUMBER',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'productionYear-header',
        'text',
        'FLEET.AIRCRAFTS.YEAR_PRODUCTION',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'quantity-header',
        'text',
        'FLEET.AIRCRAFTS.QUANTITY',
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

  public getAircraftBaseColumnsHeader(): ColumnHeaderModel[] {
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
        'FLEET.AIRCRAFTS.AIRPORT',
        new ColumnHeaderSizeModel('9', '7', '7')
      ),
      new ColumnHeaderModel(
        'type-header',
        'text',
        'FLEET.AIRCRAFTS.TYPE',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getAircraftObservationsColumnsHeader(): ColumnHeaderModel[] {
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
        'FLEET.AIRCRAFTS.OBSERVATIONS',
        new ColumnHeaderSizeModel('11', '11', '11')
      ),
    ];
  }

  public getAircraftTableDataFromAircraft(
    aircraft: Aircraft[]
  ): RowDataModel[] {
    const aircraftTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('visibility', 'view', 'FLEET.AIRCRAFTS.VIEW', 'green'));
    actions.push(
      new ColumnActionsModel('create', 'edit', 'FLEET.AIRCRAFTS.EDIT', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'FLEET.AIRCRAFTS.DELETE', 'red'));
    aircraft.forEach((element: Aircraft) => {
      const aircraftRow: RowDataModel = new RowDataModel();
      aircraftRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      aircraftRow.pushColumn(new ColumnDataModel('text', element.operator));
      aircraftRow.pushColumn(new ColumnDataModel('text', element.aircraftType));
      aircraftRow.pushColumn(new ColumnDataModel('text', element.plateNumber));
      aircraftRow.pushColumn(
        new ColumnDataModel('text', element.productionYear)
      );
      aircraftRow.pushColumn(new ColumnDataModel('text', element.quantity));
      aircraftRow.pushColumn(new ColumnDataModel('actions', actions));
      aircraftRow.author =
        element.modifiedBy != null ? element.modifiedBy : element.createdBy;
      aircraftRow.timestamp =
        element.modifiedAt != null ? element.modifiedAt : element.createdAt;
      aircraftRow.modified = element.modifiedAt != null;
      aircraftTableData.push(aircraftRow);
    });
    return aircraftTableData;
  }

  public getAircraftBaseTableData(
    bases: AircraftBase[],
    aircraftBases: AircraftBase[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const baseTableData: Array<RowDataModel> = new Array<RowDataModel>();
    bases.forEach((base: AircraftBase) => {
      const baseRow: RowDataModel = new RowDataModel();
      baseRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      baseRow.pushColumn(new ColumnDataModel('text', base.airport));
      baseRow.pushColumn(new ColumnDataModel('text', base.type));
      baseTableData.push(baseRow);
    });
    return baseTableData;
  }

  public getAircraftObservationsTableData(
    observations: any[],
    aircraftObservations: any[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const baseTableData: Array<RowDataModel> = new Array<RowDataModel>();
    observations.forEach((observation: any) => {
      const baseRow: RowDataModel = new RowDataModel();
      baseRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      baseRow.pushColumn(new ColumnDataModel('text', observation.description));
      baseTableData.push(baseRow);
    });
    return baseTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
