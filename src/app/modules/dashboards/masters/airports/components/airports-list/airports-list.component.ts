import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportsService } from '../../services/airports.service';
import { AirportsTableAdapterService } from '../../services/airports-table-adapter.service';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Airport, EMPTY_AIRPORT, CustomsType } from '../../models/airport';
import { Router } from '@angular/router';

@Component({
  selector: 'app-airports-list',
  templateUrl: './airports-list.component.html',
  styleUrls: ['./airports-list.component.scss']
})
export class AirportsListComponent implements OnInit {

  constructor(
    private readonly modalService: ModalService,
    private readonly airportsService: AirportsService,
    private readonly airportsTableAdapterService: AirportsTableAdapterService,
    private readonly router: Router
  ) { }

  @ViewChild('confirmDeleteModal', { static: true, read: ElementRef })
  private readonly confirmDeleteModal: ElementRef;
  @ViewChild('confirmDisableModal', { static: true, read: ElementRef })
  private readonly confirmDisableModal: ElementRef;

  public pageTitle = 'Aeropuertos';
  public airportColumnsHeader: Array<ColumnHeaderModel>;
  public airportsColumnsData: Array<RowDataModel>;
  public airportsSelectedCount = 0;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
    { type: BarButtonType.SEARCH, text: 'Buscar' },
    { type: BarButtonType.CHECK, text: 'Ver inactivos' }
  ];
  public airportPagination: PaginationModel;
  public airportDetailTitle: string;
  public airportSelected: Airport = EMPTY_AIRPORT;

  private selectedItem: number;
  private airports: Array<Airport>;
  private filter: string;
  private showDisabled: boolean;

  private readonly barButtonActions = {
    new: this.newAirport.bind(this),
    custom: this.disableAirport.bind(this)
  };
  private readonly airportTableActions = {
    view: this.viewAirport.bind(this),
    edit: this.editAirport.bind(this),
    delete: this.deleteAirport.bind(this),
    disable: this.disableAirport.bind(this)
  };

  ngOnInit(): void {
    this.showDisabled = false;
    this.airportColumnsHeader = this.airportsTableAdapterService.getAirportListColumnsHeader();
    this.obtainAirportsTable();
  }

  private obtainAirportsTable(): void {
    this.airportsService.getAirports(this.showDisabled, this.filter).subscribe((data: Page<Airport>) => {
      this.airports = data.content.map((airport: Airport) => {
        return {
          ...airport,
          simpleCustoms: airport.customs === CustomsType.YES
        }
      });
      this.paginarDatos();
    });
  }

  private paginarDatos(): void {
    this.airportsColumnsData = this.airportsTableAdapterService.getAirportListTableData(this.airports);
    this.airportPagination = this.airportsTableAdapterService.getPagination();
    this.airportPagination.lastPage = this.airports.length / this.airportPagination.elementsPerPage;
  }

  public onBarButtonClicked(barButtonType: BarButtonType): void {
    this.barButtonActions[barButtonType]();
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onSearch(value: string): void {
    this.filter = value;
    this.obtainAirportsTable();
  }

  public onAirportSelected(selectedIndex: number): void {
    this.selectedItem = selectedIndex;
  }

  public onAirportAction(action: { actionId: string; selectedItem: number }): void {
    this.airportTableActions[action.actionId](action.selectedItem);
  }

  private newAirport(): void {
    // TODO: Routing new screen
    this.router.navigate(['airports', 'new']);
  }

  private viewAirport(selectedItem: number): void {
    // TODO: Routing new screen
  }

  private editAirport(selectedItem: number): void {
    // TODO: Routing new screen
    this.router.navigate(['airports', this.airports[selectedItem].id ]);
  }

  private deleteAirport(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  private disableAirport(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDisableModal);
    this.modalService.openModal();
  }

  public onConfirmDeleteAirport(): void {
    this.airportsService.deleteAirport(this.getAirportModel(this.airports[this.selectedItem])).subscribe(() => {
      this.obtainAirportsTable();
    });
  }

  public onConfirmDisableAirport(): void {
    this.airportsService.disableAirport(this.getAirportModel(this.airports[this.selectedItem])).subscribe(() => {
      this.obtainAirportsTable();
    });
  }

  private getAirportModel(airport: Airport): Airport {
    const customs: CustomsType = airport.simpleCustoms ? CustomsType.YES : CustomsType.NO;
    return {
      ...airport,
      customs,
      simpleCustoms: undefined
    };
  }
  public checkShowDisabled(showDisabled: boolean): void {
    this.showDisabled = showDisabled;
    this.obtainAirportsTable();
  }
}
