import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { BarButtonType, BarButton } from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Observation } from '../../../../models/airport';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { AirportObservationsTableAdapterService } from './services/airport-observations-table-adapter.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportObservationsService } from '../../../../services/airport-observations.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Page } from 'src/app/core/models/table/pagination/page';
import { AirportObservationDetailComponent } from './components/airport-observation-detail/airport-observation-detail.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';

@Component({
  selector: 'app-airport-observations',
  templateUrl: './airport-observations.component.html',
  styleUrls: ['./airport-observations.component.scss'],
  providers: [AirportObservationsTableAdapterService],
})
export class AirportObservationsComponent implements OnInit, OnDestroy {
  @ViewChild(AirportObservationDetailComponent, {
    static: true,
    read: ElementRef,
  })
  public observationDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public observationAdvancedSearchModal: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public observationSortMenuModal: ElementRef;

  private readonly EDIT_OBSERVATION_TITLE = 'Editar observacion';
  private readonly CREATE_OBSERVATION_TITLE = 'Crear observación';
  private readonly observationFormDefaultValues = {
    id: null,
    observation: '',
  } as const;

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public observationsColumnsHeader: ColumnHeaderModel[];
  public observationsColumnsData: RowDataModel[];
  public observationsPagination: PaginationModel;
  public observationSelected: Observation;
  private observations: Observation[];
  public observationDetailTitle: string;
  private observationFilter: any = {};
  public showMobileSearchBar: boolean = false;
  public observationsSelectedCount: number = 0;
  public observationsBarButtons: BarButton[] = [
    { text: 'Nueva', type: BarButtonType.NEW },
    { text: 'Filtrar', type: BarButtonType.SEARCH },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  public observationAdvancedSearchForm = this.fb.group({
    observation: [''],
  });

  public observationSortForm = this.fb.group({
    sort: [''],
  });

  public observationForm = this.fb.group({
    id: [null],
    observation: ['', Validators.required],
  });

  constructor(
    private observationsTableAdapterService: AirportObservationsTableAdapterService,
    private observationsService: AirportObservationsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initAirportObservations();
    this.observationsPagination = this.observationsTableAdapterService.getPagination();
    this.observationsColumnsHeader = this.observationsTableAdapterService.getObservationsColumnsHeader();
  }

  private initAirportObservations(): void {
    this.route.params
      .pipe(
        tap((params) => (this.airportId = params.airportId)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((params: Params) =>
        this.refreshObservationsTableData(params.airportId)
      );
  }

  private refreshObservationsTableData(airportId: string): void {
    this.observationsService
      .getAirportObservations(airportId)
      .pipe(tap(this.getObservations))
      .subscribe(
        (observations: Page<Observation>) =>
          (this.observationsColumnsData = this.observationsTableAdapterService.getObservationsTableData(
            observations.content
          ))
      );
  }

  private getObservations = (observations: Page<Observation>): void => {
    this.observationsPagination = {
      ...this.observationsPagination,
      lastPage:
        observations.content.length /
        this.observationsPagination.elementsPerPage,
    };
    this.observations = observations.content;
  };

  public onObservationSelected(observationIndex: number): void {
    this.observationSelected = this.observations[observationIndex];
    this.observationsSelectedCount = 1;
  }

  private newObservation = () => {
    this.observationForm.reset(this.observationFormDefaultValues);
    this.observationDetailTitle = this.CREATE_OBSERVATION_TITLE;
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  };

  private editObservation = () => {
    this.observationForm.patchValue(this.observationSelected);
    this.observationDetailTitle = this.EDIT_OBSERVATION_TITLE;
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  };

  private deleteObservation = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private barButtonActions = {
    new: this.newObservation,
    edit: this.editObservation,
    delete_selected: this.deleteObservation,
    search: this.toggleSearchBar,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onSaveObservation(newObservation: Observation) {
    const saveObservation: Observable<Observation> = newObservation.id
      ? this.observationsService.editObservation(this.airportId, newObservation)
      : this.observationsService.addObservation(this.airportId, newObservation);
    saveObservation.subscribe((observation: Observation) => {
      this.refreshObservationsTableData(this.airportId);
    });
  }

  public onConfirmDeleteObservation() {
    this.observationsService.deleteObservation(this.airportId, this.observationSelected).subscribe(
      () =>
        this.refreshObservationsTableData(this.airportId)
      );
  }

  public onFilterObservations(filter: ColumnFilter) {
    this.observationFilter[filter.identifier] = filter.searchTerm;
    console.log('FILTER BY', this.observationFilter);
    this.observationAdvancedSearchForm.patchValue(this.observationFilter);
    this.filterObservationTable();
  }

  public onSortObservations(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.observationSortForm.patchValue({ sort: sort });
    console.log('DESKTOP SORTING', this.observationSortForm.value);
    this.filterObservationTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.observationAdvancedSearchForm.patchValue({ observation: searchTerm });
    console.log('FILTER MOBILE BY', this.observationAdvancedSearchForm.value);
    this.filterObservationTable();
  }

  public onMobileSort() {
    console.log('MOBILE SORTING', this.observationSortForm.value);
    this.filterObservationTable();
  }

  public onMobileAdvancedSearch() {
    console.log('ADVANCED FILTER BY', this.observationAdvancedSearchForm.value);
    this.filterObservationTable();
  }

  private filterObservationTable() {
    const filter = {
      ...this.observationAdvancedSearchForm.value,
      ...this.observationSortForm.value,
    };
    // this.refreshObservationsTableData(this.aiportId, filter);
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.observationAdvancedSearchModal);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.observationSortMenuModal);
    this.modalService.openModal();
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
