import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportsService } from '../../services/airports.service';
import { AirportsTableAdapterService } from '../../services/airports-table-adapter.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Airport, EMPTY_AIRPORT } from '../../../regions/models/airport';
import { Page } from 'src/app/core/models/table/pagination/page';

@Component({
  selector: 'app-airports-list',
  templateUrl: './airports-list.component.html',
  styleUrls: ['./airports-list.component.scss']
})
export class AirportsListComponent implements OnInit {

  
  constructor(
    private readonly modalService: ModalService,
    private readonly airportsService: AirportsService,
    private readonly airportsTableAdapterService: AirportsTableAdapterService
  ) { }

  // @ViewChild(AirportDetailComponent, { static: true, read: ElementRef })
  // private readonly airportDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmDeleteModal: ElementRef;

  private readonly VIEW_AIRPORT_TITLE = 'Detalle aeropuerto';
  private readonly EDIT_AIRPORT_TITLE = 'Editar aeropuerto';
  private readonly CREATE_AIRPORT_TITLE = 'Crear aeropuerto';

  public pageTitle = 'Aeropuertos';
  public airportColumnsHeader: Array<ColumnHeaderModel>;
  public airportsColumnsData: Array<RowDataModel>;
  public airportsSelectedCount = 0;
  public barButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo aeropuerto' },
    { type: BarButtonType.DELETE, text: 'Borrar' },
  ];
  public airportPagination: PaginationModel;
  public airportDetailTitle: string;
  public airportSelected: Airport = EMPTY_AIRPORT;

  private selectedItem: number;
  private airports: Array<Airport>;
  private readonly barButtonActions = { new: this.newAirport.bind(this) };
  private readonly airportTableActions = {
    view: this.viewAirport.bind(this),
    edit: this.editAirport.bind(this),
    delete: this.deleteAirport.bind(this)
  };

  ngOnInit(): void {
    this.initializeAirportsTable();
  }

  private initializeAirportsTable(): void {
    this.airportColumnsHeader = this.airportsTableAdapterService.getAirportColumnsHeader();
    this.airportsService.getAirports().subscribe((data: Page<Airport>) => {
      this.airports = data.content;
      this.airportsColumnsData = this.airportsTableAdapterService.getAirportTableData(this.airports);
      this.airportPagination = this.airportsTableAdapterService.getPagination();
      this.airportPagination.lastPage = this.airports.length / this.airportPagination.elememtsPerpage;
    });
  }

  public onBarButtonClicked(barButtonType: BarButtonType): void {
    this.barButtonActions[barButtonType]();
  }


  private initializeAirportDetailModal(airportDetailTitle: string, airportSelected: Airport): void {
    this.airportDetailTitle = airportDetailTitle;
    this.airportSelected = airportSelected;
    // TODO: this.initializeModal(this.airportDetailModal);
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  public onAirportSelected(selectedIndex: number): void {
    this.selectedItem = selectedIndex;
  }

  public onAirportAction(action: { actionId: string; selectedItem: number }): void {
    this.airportTableActions[action.actionId](action.selectedItem);
  }

  private newAirport(): void {
    this.airportDetailTitle = this.CREATE_AIRPORT_TITLE;
    this.initializeAirportDetailModal(this.CREATE_AIRPORT_TITLE, { ...EMPTY_AIRPORT });
    this.modalService.openModal();
  }

  private viewAirport(selectedItem: number): void {
    this.initializeAirportDetailModal(this.VIEW_AIRPORT_TITLE, {
      ...this.airports[selectedItem],
    });
    this.modalService.openModal();
  }

  private editAirport(selectedItem: number): void {
    this.initializeAirportDetailModal(this.EDIT_AIRPORT_TITLE, {
      ...this.airports[selectedItem],
    });
    this.modalService.openModal();
  }

  private deleteAirport(selectedItem: number): void {
    this.selectedItem = selectedItem;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onConfirmDeleteAirport(): void {
    this.airportsService.deleteAirport(this.airports[this.selectedItem]).subscribe(() => {
      this.initializeAirportsTable();
    });
  }
/* TODO:
  public onSaveAirport(airport: Airport): void {
    let saveAirport: Observable<Airport>;
    if (airport.id === undefined) {
      saveAirport = this.airportsService.addAirport(airport);
    } else {
      saveAirport = this.airportsService.editAirport(airport);
    }
    saveAirport.subscribe((data: Airport) => this.initializeAirportTable());
  }
*/
}
