import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Region } from '../models/region';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { Airport } from '../models/airport';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Country } from '../../countries/models/country';

@Injectable({
  providedIn: 'root',
})
export class RegionsTableAdapterService {
  constructor() {}

  public getRegionColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('6', '6', '6')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('4', '4', '4')
      ),
    ];
  }

  public getRegionTableDataFromRegions(regions: Region[]): RowDataModel[] {
    const regionTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(new ColumnActionsModel('visibility', 'view', 'Ver', 'green'));
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    regions.forEach((region: Region) => {
      const regionRow: RowDataModel = new RowDataModel();
      regionRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      regionRow.pushColumn(new ColumnDataModel('text', region.name));
      regionRow.pushColumn(new ColumnDataModel('actions', actions));
      regionTableData.push(regionRow);
    });
    return regionTableData;
  }

  public getRegionCountryColumnsHeader(): ColumnHeaderModel[] {
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

  public getRegionCountryTableData(
    countries: Country[],
    regionCountries: Country[],
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
          check: this.hasRegionAssignedCountry(regionCountries, country),
          disable: !editable,
        })
      );
      roleTableData.push(countryRow);
    });
    return roleTableData;
  }

  private hasRegionAssignedCountry(
    regionCountries: Country[],
    country: Country
  ): boolean {
    return !!(
      regionCountries &&
      regionCountries.find(
        (regionCountry: Country) => regionCountry.id === country.id
      )
    );
  }

  public getRegionAirportColumnsHeader(): ColumnHeaderModel[] {
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

  public getRegionAirportTableData(
    airports: Airport[],
    regionAirports: Airport[],
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
          check: this.hasRegionAssignedAirport(regionAirports, airport),
          disable: !editable,
        })
      );
      airportTableData.push(airportRow);
    });
    return airportTableData;
  }

  private hasRegionAssignedAirport(
    regionAirports: Airport[],
    airport: Airport
  ): boolean {
    return !!(
      regionAirports &&
      regionAirports.find(
        (regionAirport: Airport) => regionAirport.id === airport.id
      )
    );
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
