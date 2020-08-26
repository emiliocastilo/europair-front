import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Airport } from '../../../../airports/models/airport';

@Injectable()
export class OperatorAirportsTableAdapterService {
  constructor() { }

  public getAirportsColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'operator-iata-header',
        'search',
        'IATA',
        new ColumnHeaderSizeModel('5', '3', '3'),
        'iataCode'
      ),
      new ColumnHeaderModel(
        'operator-icao-header',
        'search',
        'Name',
        new ColumnHeaderSizeModel('5', '3', '3'),
        'icaoCode'
      ),
      new ColumnHeaderModel(
        'operator-name-header',
        'search',
        'City',
        new ColumnHeaderSizeModel('0', '5', '5'),
        'name'
      ),
    ];
  }

  public getAirportsTableData(airports: Airport[]): RowDataModel[] {
    const airportTableData: RowDataModel[] = new Array<RowDataModel>();
    airports.forEach((airport: Airport) => {
      const airportRow: RowDataModel = new RowDataModel();
      airportRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      airportRow.pushColumn(new ColumnDataModel('text', airport.iataCode));
      airportRow.pushColumn(new ColumnDataModel('text', airport.name));
      airportRow.pushColumn(new ColumnDataModel('text', airport.city?.name));
      airportTableData.push(airportRow);
    });
    return airportTableData;
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
