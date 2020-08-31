import { Injectable } from '@angular/core';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Aircraft, AircraftBase, AircraftObservation } from '../models/Aircraft.model';
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
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'Aeropuerto',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'aircraftType-header',
        'text',
        'Tipo',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'category-header',
        'text',
        'Categoría',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'subcategory-header',
        'text',
        'Subcategoría',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'plateNumber-header',
        'text',
        'Matrícula',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'productionYear-header',
        'text',
        'Año de fabricación',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'outsideUpgradeYear-header',
        'text',
        'Año reforma exterior',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'quantity-header',
        'text',
        'Cantidad',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'insuranceEndDate-header',
        'text',
        'Caducidad seguro',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
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
        'base-header',
        'text',
        'FLEET.AIRCRAFTS.MAIN_BASE',
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

  public getAircraftTableDataFromAircraft(aircraft: Aircraft[]): RowDataModel[] {
    const aircraftTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('create', 'edit', 'FLEET.AIRCRAFTS.EDIT', 'europair-icon-blue'));
    actions.push(new ColumnActionsModel('delete', 'delete', 'FLEET.AIRCRAFTS.DELETE', 'red'));
    aircraft.forEach((aircraft: Aircraft) => {
      const aircraftRow: RowDataModel = new RowDataModel();
      aircraftRow.pushColumn(new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true)));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.operator?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', 'airport'));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.code));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.category?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.subcategory?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.plateNumber));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.productionYear));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.outsideUpgradeYear));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.quantity));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.insuranceEndDate));
      aircraftRow.pushColumn(new ColumnDataModel('actions', actions));
      aircraftRow.setAuditParams(aircraft);
      aircraftTableData.push(aircraftRow);
    });
    return aircraftTableData;
  }

  public getAircraftBaseTableData(bases: AircraftBase[]): RowDataModel[] {
    const baseTableData: Array<RowDataModel> = new Array<RowDataModel>();
    bases.forEach((base: AircraftBase) => {
      const baseRow: RowDataModel = new RowDataModel();
      baseRow.pushColumn(new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true)));
      baseRow.pushColumn(new ColumnDataModel('text', base.airport.name));
      baseRow.pushColumn(new ColumnDataModel('switch', {id: `main-${base.id}`, check: base.mainBase, disable: true}));
      baseTableData.push(baseRow);
    });
    return baseTableData;
  }

  public getAircraftObservationsTableData(elements: AircraftObservation[]): RowDataModel[] {
    const baseTableData: Array<RowDataModel> = new Array<RowDataModel>();
    elements.forEach((observation: AircraftObservation) => {
      const baseRow: RowDataModel = new RowDataModel();
      baseRow.pushColumn(new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true)));
      baseRow.pushColumn(new ColumnDataModel('text', observation.observation));
      baseTableData.push(baseRow);
    });
    return baseTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
