import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Airport, Track } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class AirportsTableAdapterService {
  constructor() { }

  public getAirportListColumnsHeader(): ColumnHeaderModel[] {
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
        'IATA',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'ICAO',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('4', '2', '3')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Ciudad',
        new ColumnHeaderSizeModel('1', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Pais',
        new ColumnHeaderSizeModel('1', '2', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Pista',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '3')
      ),
    ];
  }

  public getAirportListTableData(airports: Array<Airport>): Array<RowDataModel> {
    const airportTableData: Array<RowDataModel> = new Array<RowDataModel>();
    const actions: Array<ColumnActionsModel> = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('do_not_disturb', 'disable', 'Deshabilitar', 'red'));
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    airports.forEach((airport: Airport) => {
      const airportRow: RowDataModel = new RowDataModel();
      airportRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      airportRow.pushColumn(new ColumnDataModel('text', airport.iataCode));
      airportRow.pushColumn(new ColumnDataModel('text', airport.icaoCode));
      airportRow.pushColumn(new ColumnDataModel('text', airport.name));
      airportRow.pushColumn(new ColumnDataModel('text', airport.city.name));
      airportRow.pushColumn(new ColumnDataModel('text', airport.country.name));
      airportRow.pushColumn(this.getTrackColumnData(airport));
      airportRow.pushColumn(new ColumnDataModel('actions', actions));
      airportRow.setAuditParams(airport);
      airportTableData.push(airportRow);
    });
    return airportTableData;
  }

  private getTrackColumnData(airport: Airport): ColumnDataModel {
    const track: Track = airport.runways?.find((item: Track) => item.mainRunway);
    let column: ColumnDataModel;
    if (track) {
      column =  new ColumnDataModel('translate', `MEASURES.VALUE.${track.length.type}`,{'value': track.length.value});
    } else {
      column = new ColumnDataModel('text', '');
    }
    return column;
  }

  public getPagination() {
    const clientPagination: boolean = true;
    const initPage: number = 1;
    const visiblePages: number = 4;
    const lastPage: number = 5;
    const elementsPerPage: number = 20;
    return new PaginationModel(clientPagination, initPage, visiblePages, lastPage, elementsPerPage);
  }
}
