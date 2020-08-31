import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import {
  FleetType,
  FleetTypeObservation,
  AverageSpeed,
} from '../../../models/fleet';

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
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Descripción',
        new ColumnHeaderSizeModel('1', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Categoría',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Subcategoría',
        new ColumnHeaderSizeModel('4', '3', '3')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Rango de vuelo',
        new ColumnHeaderSizeModel('2', '2', '1')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '2')
      ),
    ];
  }

  public getFleetTypeAverageSpeedColumnsHeader(): ColumnHeaderModel[] {
    return [
      new ColumnHeaderModel(
        'selector-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'fromDistance-header',
        'text',
        'Desde',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'toDistance-header',
        'text',
        'Hasta',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'distanceUnit-header',
        'text',
        'Unidad distancia',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'averageSpeed-header',
        'text',
        'Velocidad Media',
        new ColumnHeaderSizeModel('2', '2', '2')
      ),
      new ColumnHeaderModel(
        'averageSpeedUnit-header',
        'text',
        'Unidad velocidad',
        new ColumnHeaderSizeModel('3', '3', '3')
      ),
    ];
  }

  public getFleetTypeObservationColumnsHeader(): ColumnHeaderModel[] {
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
        'Observaciones',
        new ColumnHeaderSizeModel('11', '11', '11')
      ),
    ];
  }

  public getFleetTypes(fleetTypes: Array<FleetType>): RowDataModel[] {
    const fleetTypeTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    fleetTypes.forEach((fleetType: FleetType) => {
      const fleetTypeRow: RowDataModel = new RowDataModel();
      fleetTypeRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      fleetTypeRow.pushColumn(new ColumnDataModel('text', fleetType.code));
      fleetTypeRow.pushColumn(
        new ColumnDataModel('text', fleetType.description)
      );
      fleetTypeRow.pushColumn(
        new ColumnDataModel('text', fleetType.category.name)
      );
      fleetTypeRow.pushColumn(
        new ColumnDataModel('text', fleetType.subcategory.name)
      );
      fleetTypeRow.pushColumn(this.getFlightRangeColumn(fleetType));
      fleetTypeRow.pushColumn(new ColumnDataModel('actions', actions));
      fleetTypeRow.setAuditParams(fleetType);
      fleetTypeTableData.push(fleetTypeRow);
    });
    return fleetTypeTableData;
  }

  public getFleetTypeSpeedAverageTableData(
    elements: AverageSpeed[]
  ): RowDataModel[] {
    const averageSpeedTableData: Array<RowDataModel> = new Array<
      RowDataModel
    >();
    elements.forEach((elem: AverageSpeed) => {
      const averageSpeedRow: RowDataModel = new RowDataModel();
      averageSpeedRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      averageSpeedRow.pushColumn(
        new ColumnDataModel('text', elem.fromDistance)
      );
      averageSpeedRow.pushColumn(new ColumnDataModel('text', elem.toDistance));
      averageSpeedRow.pushColumn(
        new ColumnDataModel('translate', `MEASURES.UNITS.${elem.distanceUnit}`)
      );
      averageSpeedRow.pushColumn(
        new ColumnDataModel('text', elem.averageSpeed)
      );
      averageSpeedRow.pushColumn(
        new ColumnDataModel(
          'translate',
          `MEASURES.UNITS.${elem.averageSpeedUnit}`
        )
      );
      averageSpeedTableData.push(averageSpeedRow);
    });
    return averageSpeedTableData;
  }

  public getFleetTypeObservationsTableData(
    elements: FleetTypeObservation[]
  ): RowDataModel[] {
    const observationTableData: Array<RowDataModel> = new Array<RowDataModel>();
    elements.forEach((elem: FleetTypeObservation) => {
      const observationRow: RowDataModel = new RowDataModel();
      observationRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      observationRow.pushColumn(new ColumnDataModel('text', elem.observation));
      observationTableData.push(observationRow);
    });
    return observationTableData;
  }

  private getFlightRangeColumn(fleetType): ColumnDataModel {
    let column: ColumnDataModel;
    if (fleetType && fleetType.flightRange && fleetType.flightRangeUnit) {
      column = new ColumnDataModel(
        'translate',
        `MEASURES.VALUE.${fleetType.flightRangeUnit}`,
        { value: this.formatNumber(fleetType.flightRange) }
      );
    } else {
      column = new ColumnDataModel('text', '');
    }
    return column;
  }

  private formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public getPagination() {
    return new PaginationModel(true, 1, 3, 5, 10);
  }
}
