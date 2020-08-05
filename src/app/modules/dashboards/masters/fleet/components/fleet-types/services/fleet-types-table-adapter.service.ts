import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { FleetType } from '../models/fleet-type';

@Injectable({
  providedIn: 'root',
})
export class FleetTypesTableAdapterService {
  constructor() {}

  public getFleetTypeColumnsHeader(): ColumnHeaderModel[] {
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
        'Código',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
    ];
  }

  public getFleetTypeTableDataFromFleetTypes(fleetTypes: FleetType[]): RowDataModel[] {
    const fleetTypeTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('visibility', 'view', 'Ver', 'green'));
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    fleetTypes.forEach((fleetType: FleetType) => {
      const fleetTypeRow: RowDataModel = new RowDataModel();
      fleetTypeRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.name));
      fleetTypeRow.pushColumn(new ColumnDataModel('actions', actions));
      fleetTypeTableData.push(fleetTypeRow);
    });
    return fleetTypeTableData;
  }

  public getFleetTypeCountryColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'País',
        new ColumnHeaderSizeModel('10', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignado',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getFleetTypeCountryTableData(
    countries: Country[],
    fleetTypeCountries: Country[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const roleTableData: RowDataModel[] = new Array<RowDataModel>();
    countries.forEach((country: Country) => {
      const countryRow: RowDataModel = new RowDataModel();
      countryRow.pushColumn(new ColumnDataModel('text', country.name));
      countryRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + country.id,
          check: this.hasFleetTypeAssignedCountry(fleetTypeCountries, country),
          disable: !editable,
        })
      );
      roleTableData.push(countryRow);
    });
    return roleTableData;
  }

  private hasFleetTypeAssignedCountry(
    fleetTypeCountries: Country[],
    country: Country
  ): boolean {
    return !!(
      fleetTypeCountries &&
      fleetTypeCountries.find(
        (fleetTypeCountry: Country) => fleetTypeCountry.id === country.id
      )
    );
  }

  public getFleetTypeAirportColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'screen-header',
        'text',
        'Aeropuerto',
        new ColumnHeaderSizeModel('10', '8', '8')
      ),
      new ColumnHeaderModel(
        'assigned-header',
        'text',
        'Asignado',
        new ColumnHeaderSizeModel('2', '4', '4')
      ),
    ];
  }

  public getFleetTypeAirportTableData(
    airports: Airport[],
    fleetTypeAirports: Airport[],
    idPrefix: string,
    editable = true
  ): RowDataModel[] {
    const airportTableData: RowDataModel[] = new Array<RowDataModel>();
    airports.forEach((airport: Airport) => {
      const airportRow: RowDataModel = new RowDataModel();
      airportRow.pushColumn(new ColumnDataModel('text', airport.name));
      airportRow.pushColumn(
        new ColumnDataModel('switch', {
          id: idPrefix + airport.id,
          check: this.hasFleetTypeAssignedAirport(fleetTypeAirports, airport),
          disable: !editable,
        })
      );
      airportTableData.push(airportRow);
    });
    return airportTableData;
  }

  private hasFleetTypeAssignedAirport(
    fleetTypeAirports: Airport[],
    airport: Airport
  ): boolean {
    return !!(
      fleetTypeAirports &&
      fleetTypeAirports.find(
        (fleetTypeAirport: Airport) => fleetTypeAirport.id === airport.id
      )
    );
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
