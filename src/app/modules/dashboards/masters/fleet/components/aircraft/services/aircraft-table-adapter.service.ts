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
        'selectAll',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'operator-header',
        'search',
        'FLEET.AIRCRAFTS.OPERATOR',
        new ColumnHeaderSizeModel('3', '1', '1'),
        'filter_operator.name',
        'operator.name'
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'FLEET.AIRCRAFTS.AIRPORT',
        new ColumnHeaderSizeModel('3', '1', '1')
      ),
      new ColumnHeaderModel(
        'aircraftType-header',
        'search',
        'FLEET.AIRCRAFTS.TYPE',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_aircraftType.code',
        'aircraftType.code'
      ),
      new ColumnHeaderModel(
        'category-header',
        'search',
        'FLEET.AIRCRAFTS.CATEGORY',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_aircraftType.category.name',
        'aircraftType.category.name'
      ),
      new ColumnHeaderModel(
        'subcategory-header',
        'search',
        'FLEET.AIRCRAFTS.SUBCATEGORY',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_aircraftType.subcategory.name',
        'aircraftType.subcategory.name'
      ),
      new ColumnHeaderModel(
        'plateNumber-header',
        'search',
        'FLEET.AIRCRAFTS.PLATE_NUMBER',
        new ColumnHeaderSizeModel('3', '1', '1'),
        'filter_plateNumber',
        'plateNumber'
      ),
      new ColumnHeaderModel(
        'productionYear-header',
        'search',
        'FLEET.AIRCRAFTS.YOM',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_productionYear',
        'productionYear'
      ),
      new ColumnHeaderModel(
        'outsideUpgradeYear-header',
        'search',
        'FLEET.AIRCRAFTS.OUTSIDE_UPGRADE_YEAR',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_outsideUpgradeYear',
        'outsideUpgradeYear'
      ),
      new ColumnHeaderModel(
        'quantity-header',
        'search',
        'FLEET.AIRCRAFTS.QUANTITY',
        new ColumnHeaderSizeModel('', '1', '1'),
        'filter_quantity',
        'quantity'
      ),
      new ColumnHeaderModel(
        'insuranceEndDate-header',
        'text',
        'FLEET.AIRCRAFTS.INSURANCE_END_DATE',
        new ColumnHeaderSizeModel('', '1', '1'),
        '',
        'insuranceEndDate'
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
      aircraftRow.pushColumn(new ColumnDataModel('text', this.getAirportBase(aircraft)));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.code));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.category?.code));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.subcategory?.code));
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

  private getAirportBase(aircraft: Aircraft): string {
    const mainBase: AircraftBase = aircraft.bases.find((base: AircraftBase) => base.mainBase);
    return mainBase?.airport?.iataCode;
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
