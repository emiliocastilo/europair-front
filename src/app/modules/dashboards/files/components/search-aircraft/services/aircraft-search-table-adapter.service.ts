import { Injectable } from '@angular/core';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Aircraft, AircraftBase } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';

@Injectable({
  providedIn: 'root',
})
export class AircraftSearchTableAdapterService {
  constructor() { }
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
        'text',
        'SEARCH_AIRCRAFT.OPERATOR',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.DATE_AOC',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.INSURANCE_DATE',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.AIRPORT',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.CATEGORY',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.SUBCATEGORY',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'aircraftType-header',
        'text',
        'SEARCH_AIRCRAFT.TYPE',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'quantity-header',
        'text',
        'SEARCH_AIRCRAFT.QUANTITY',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.SEATS',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),/*
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.BEDS',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),*/
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.MAXIMUM_LOAD',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'airport-header',
        'text',
        'SEARCH_AIRCRAFT.OBSERVATIONS',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
    ];
  }

  public getAircraftTableDataFromAircraft(aircraft: Aircraft[]): RowDataModel[] {
    const aircraftTableData: RowDataModel[] = new Array<RowDataModel>();
    aircraft.forEach((aircraft: Aircraft) => {
      const aircraftRow: RowDataModel = new RowDataModel();
      aircraftRow.pushColumn(new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true)));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.operator?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.operator?.aocLastRevisionDate));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.operator?.insuranceExpirationDate));
      aircraftRow.pushColumn(new ColumnDataModel('text', this.getAirport(aircraft)));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.category?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.subcategory?.name));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.aircraftType?.description));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.quantity));
      aircraftRow.pushColumn(new ColumnDataModel('text', this.getSeatsFCY(aircraft)));
      //aircraftRow.pushColumn(new ColumnDataModel('text', 'cama'));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.load?.maximumLoad));
      aircraftRow.pushColumn(new ColumnDataModel('text', aircraft.observations?.toString()));
      aircraftRow.setAuditParams(aircraft);
      aircraftTableData.push(aircraftRow);
    });
    return aircraftTableData;
  }

  private getAirport(aircraft: Aircraft): string {
    let airports: string = '';
    if (aircraft.bases) {
      const base: AircraftBase = aircraft.bases.find((aircraftBase: AircraftBase) => aircraftBase.mainBase);
      airports = base?.airport.name || '';
    }
    return airports;
  }

  private getSeatsFCY(aircraft: Aircraft): string {
    return `${aircraft.seatingF} / ${aircraft.seatingC} / ${aircraft.seatingY}`;
  }

  public getPagination(): PaginationModel {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
