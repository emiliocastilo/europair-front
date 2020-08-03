import { Injectable } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { ColumnHeaderSizeModel } from 'src/app/core/models/table/colum-header-size.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { ColumnActionsModel } from 'src/app/core/models/table/columns/column-actions.model';
import { ColumnDataModel } from 'src/app/core/models/table/colum-data.model';
import { ColumnCheckboxModel } from 'src/app/core/models/table/columns/column-checkbox.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { FleetCategory, FleetSubcategory } from '../../../models/fleet';
import { Country } from '../../../../countries/models/country';
import { Airport } from '../../../../regions/models/airport';

@Injectable({
  providedIn: 'root',
})
export class FleetCategoriesTableAdapterService {
  constructor() {}

  public getFleetCategoryColumnsHeader(): ColumnHeaderModel[] {
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
        new ColumnHeaderSizeModel('5', '5', '4')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('5', '5', '5')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '2')
      ),
    ];
  }

  public getFleetSubcategoryColumnsHeader(): ColumnHeaderModel[] {
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
        'Orden',
        new ColumnHeaderSizeModel('1', '1', '1')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Código',
        new ColumnHeaderSizeModel('4', '4', '3')
      ),
      new ColumnHeaderModel(
        'task-header',
        'text',
        'Nombre',
        new ColumnHeaderSizeModel('5', '5', '5')
      ),
      new ColumnHeaderModel(
        'actions-header',
        'text',
        '',
        new ColumnHeaderSizeModel('1', '1', '2')
      ),
    ];
  }

  public getFleetCategories(fleetCategories: FleetCategory[]): RowDataModel[] {
    const fleetCategoryTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    fleetCategories.forEach((fleetCategory: FleetCategory) => {
      const fleetCategoryRow: RowDataModel = new RowDataModel();
      fleetCategoryRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      fleetCategoryRow.pushColumn(new ColumnDataModel('text', fleetCategory.code));
      fleetCategoryRow.pushColumn(new ColumnDataModel('text', fleetCategory.name));
      fleetCategoryRow.pushColumn(new ColumnDataModel('actions', actions));
      fleetCategoryTableData.push(fleetCategoryRow);
    });
    return fleetCategoryTableData;
  }

  public getFleetSubcategories(fleetSubcategories: FleetSubcategory[]): RowDataModel[] {
    const fleetCategoryTableData: RowDataModel[] = new Array<RowDataModel>();
    const actions: ColumnActionsModel[] = new Array();
    actions.push(
      new ColumnActionsModel('create', 'edit', 'Editar', 'europair-icon-blue')
    );
    actions.push(new ColumnActionsModel('delete', 'delete', 'Eliminar', 'red'));
    fleetSubcategories.forEach((fleetSubcategory: FleetSubcategory) => {
      const fleetCategoryRow: RowDataModel = new RowDataModel();
      fleetCategoryRow.pushColumn(
        new ColumnDataModel('checkbox', new ColumnCheckboxModel('', '', true))
      );
      fleetCategoryRow.pushColumn(new ColumnDataModel('text', fleetSubcategory.order));
      fleetCategoryRow.pushColumn(new ColumnDataModel('text', fleetSubcategory.code));
      fleetCategoryRow.pushColumn(new ColumnDataModel('text', fleetSubcategory.name));
      fleetCategoryRow.pushColumn(new ColumnDataModel('actions', actions));
      fleetCategoryTableData.push(fleetCategoryRow);
    });
    return fleetCategoryTableData;
  }

  private hasFleetCategoryAssignedSubcategory(
    subcategory: FleetSubcategory,
    categories: FleetCategory[]
  ): boolean {
    return !!(
      categories &&
      categories.find(
        (category: FleetCategory) => subcategory.category.id === category.id
      )
    );
  }

  public getPagination(){
    const clientPagination: boolean = true;
    const initPage: number = 1;
    const visiblePages: number = 4;
    const lastPage: number = 5;
    const elememtsPerpage: number = 8;
    return new PaginationModel(clientPagination, initPage, visiblePages, lastPage, elememtsPerpage);
  }
}
