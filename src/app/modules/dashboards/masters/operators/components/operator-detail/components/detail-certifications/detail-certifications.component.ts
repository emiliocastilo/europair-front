import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Certification } from '../../../../models/Operator.model';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { map, tap } from 'rxjs/operators';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { OperatorAirportsTableAdapterService } from '../../service/operator-airports-table-adapter.service';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { AirportsService } from 'src/app/modules/dashboards/masters/airports/services/airports.service';

@Component({
  selector: 'app-detail-certifications',
  templateUrl: './detail-certifications.component.html',
  styleUrls: ['./detail-certifications.component.scss'],
  providers: [OperatorAirportsTableAdapterService]
})
export class DetailCertificationsComponent implements OnInit {
  @Input()
  public certifiedOperator: Certification;
  @Input()
  public airportSelected: Airport;
  @Input()
  public certifiedOperatorForm: FormGroup;
  @Input()
  public modeCreate: boolean;
  @Output()
  public saveCertifiedOperator = new EventEmitter<Certification>();

  public airportsColumnsHeader: ColumnHeaderModel[];
  public airportsColumnsData: RowDataModel[];
  public airportPagination: PaginationModel;
  private airports: Airport[];
  private airportFilter: any = {};

  constructor(
    private airportsService: AirportsService,
    private operatorsTableAdapterService: OperatorAirportsTableAdapterService
  ) { }

  ngOnInit(): void {
    this.refreshRegionsEditorTableData();
    this.airportPagination = this.operatorsTableAdapterService.getPagination();
    this.airportsColumnsHeader = this.operatorsTableAdapterService.getAirportsColumnsHeader();
  }

  private refreshRegionsEditorTableData(): void {
    this.airportsService
      .getAirports()
      .pipe(
        map((paginatedAirports) => paginatedAirports.content),
        tap(this.getAirports)
      )
      .subscribe(
        (airports: Airport[]) =>
          (this.airportsColumnsData = this.operatorsTableAdapterService.getAirportsTableData(airports))
      );
  }

  private getAirports = (airports: Airport[]): void => {
    this.airportPagination = {
      ...this.airportPagination,
      lastPage: airports.length / this.airportPagination.elementsPerPage,
    };
    this.airports = airports;
  };

  public onSaveCertifiedOperator() {
    this.saveCertifiedOperator.next({
      ...this.certifiedOperatorForm.value,
      airport: this.airportSelected,
    });
  }

  public onAirportSelected(airportIndex: number): void {
    this.airportSelected = this.airports[airportIndex];
  }

  public onFilterAirports(filter: ColumnFilter) {
    this.airportFilter[filter.identifier] = filter.searchTerm;
    this.filterOperatorTable();
  }

  public onSortAirports(sortByColumn: SortByColumn) {
    this.airportFilter['sort'] = sortByColumn.column + ',' + sortByColumn.order;
    this.filterOperatorTable();
  }

  private filterOperatorTable() {
    console.log('FILTERING OPERATOR TABLE', this.airportFilter);
    this.refreshRegionsEditorTableData();
  }

  public hasAnyAirportSelected(): boolean {
    return !!this.airportSelected;
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.certifiedOperatorForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
