import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AirportRegionsTableAdapterService } from '../../services/airport-regions-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Region } from 'src/app/modules/dashboards/masters/regions/models/region';
import { RegionsService } from 'src/app/modules/dashboards/masters/regions/services/regions.service';
import { tap, filter, map } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';

@Component({
  selector: 'app-airport-region-editor',
  templateUrl: './airport-region-editor.component.html',
  styleUrls: ['./airport-region-editor.component.scss'],
})
export class AirportRegionEditorComponent implements OnInit {
  @Output()
  public addRegions = new EventEmitter<Region>();

  public regionsColumnsHeader: ColumnHeaderModel[];
  public regionsColumnsData: RowDataModel[];
  public regionsPagination: PaginationModel;
  public regionSelected: Region;
  private regions: Region[];
  private regionFilter: any = {};

  constructor(
    private regionsTableAdapterService: AirportRegionsTableAdapterService,
    private regionsService: RegionsService
  ) {}

  ngOnInit(): void {
    this.refreshRegionsEditorTableData();
    this.regionsPagination = this.regionsTableAdapterService.getPagination();
    this.regionsColumnsHeader = this.regionsTableAdapterService.getRegionsEditorColumnsHeader();
  }

  private refreshRegionsEditorTableData(): void {
    this.regionsService
      .getRegions()
      .pipe(
        map((paginatedRegions) => paginatedRegions.content),
        tap(this.getRegions)
      )
      .subscribe(
        (regions: Region[]) =>
          (this.regionsColumnsData = this.regionsTableAdapterService.getRegionsTableData(
            regions
          ))
      );
  }

  private getRegions = (regions: Region[]): void => {
    this.regionsPagination = {
      ...this.regionsPagination,
      lastPage: regions.length / this.regionsPagination.elementsPerPage,
    };
    this.regions = regions;
  };

  public onRegionSelected(regionIndex: number): void {
    this.regionSelected = this.regions[regionIndex];
  }

  public onFilterRegions(filter: ColumnFilter) {
    this.regionFilter[filter.identifier] = filter.searchTerm;
    this.filterRegionTable();
  }

  public onSortRegions(sortByColumn: SortByColumn) {
    this.regionFilter['sort'] = sortByColumn.column + ',' + sortByColumn.order;
    this.filterRegionTable();
  }

  private filterRegionTable() {
    console.log('FILTERING REGION TABLE', this.regionFilter);
    this.refreshRegionsEditorTableData();
  }

  public hasAnyRegionSelected(): boolean {
    return !!this.regionSelected;
  }

  public onAddRegions() {
    this.addRegions.next(this.regionSelected);
  }
}
