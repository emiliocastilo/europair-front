import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { AirportRunwaysTableAdapterService } from './services/airport-runways-table-adapter.service';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { RunwaysService } from '../../../../services/runways.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Track } from '../../../../models/airport';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportRunwayDetailComponent } from './components/airport-runways-detail/airport-runway-detail.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';

@Component({
  selector: 'app-airport-runways',
  templateUrl: './airport-runways.component.html',
  styleUrls: ['./airport-runways.component.scss'],
  providers: [AirportRunwaysTableAdapterService],
})
export class AirportRunwaysComponent implements OnInit, OnDestroy {
  @ViewChild(AirportRunwayDetailComponent, { static: true, read: ElementRef })
  public runwayDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public runwayAdvancedSearchModal: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public runwaySortMenuModal: ElementRef;

  private readonly EDIT_RUNWAY_TITLE = 'Editar pista';
  private readonly CREATE_RUNWAY_TITLE = 'Crear pista';
  private readonly runwayFormDefaultValues = {
    id: null,
    length: {
      value: '',
      type: null,
    },
    width: {
      value: '',
      type: null,
    },
    observation: '',
  } as const;

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public runwaysColumnsHeader: ColumnHeaderModel[];
  public runwaysColumnsData: RowDataModel[];
  public runwaysPagination: PaginationModel;
  public runwaySelected: Track;
  private runways: Track[];
  public runwayDetailTitle: string;

  public showMobileSearchBar: boolean = false;
  public runwaysSelectedCount: number = 0;
  public runwaysBarButtons: BarButton[] = [
    { text: 'Nueva', type: BarButtonType.NEW },
    { text: 'Filtrar', type: BarButtonType.SEARCH },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  public runwayAdvancedSearchForm = this.fb.group({
    name: [''],
  });

  public runwaySortForm = this.fb.group({
    sort: [''],
  });

  public runwayForm = this.fb.group({
    id: [null],
    name: [''],
    length: this.fb.group({
      value: ['', Validators.required],
      type: [null, Validators.required],
    }),
    width: this.fb.group({
      value: ['', Validators.required],
      type: [null, Validators.required],
    }),
    observation: [''],
  });

  constructor(
    private runwaysTableAdapterService: AirportRunwaysTableAdapterService,
    private runwaysService: RunwaysService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initAirportRunways();
    this.runwaysPagination = this.runwaysTableAdapterService.getPagination();
    this.runwaysColumnsHeader = this.runwaysTableAdapterService.getRunwaysColumnsHeader();
  }

  private initAirportRunways(): void {
    this.route.params
      .pipe(
        tap((params) => (this.airportId = params.airportId)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((params: Params) =>
        this.refreshRunwaysTableData(params.airportId)
      );
  }

  private refreshRunwaysTableData(airportId: string): void {
    this.runwaysService
      .getAirportRunways(airportId)
      .pipe(tap(this.getRunways))
      .subscribe(
        (runways: Page<Track>) =>
          (this.runwaysColumnsData = this.runwaysTableAdapterService.getRunwaysTableData(
            runways.content
          ))
      );
  }

  private getRunways = (runways: Page<Track>): void => {
    this.runwaysPagination = {
      ...this.runwaysPagination,
      lastPage: runways.content.length / this.runwaysPagination.elementsPerPage,
    };
    this.runways = runways.content;
  };

  public onRunwaySelected(runwayIndex: number): void {
    this.runwaySelected = this.runways[runwayIndex];
    this.runwaysSelectedCount = 1;
  }

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }

  private newRunway = () => {
    this.runwayForm.reset(this.runwayFormDefaultValues);
    this.runwayDetailTitle = this.CREATE_RUNWAY_TITLE;
    this.initializeModal(this.runwayDetailModal);
    this.modalService.openModal();
  };

  private editRunway = () => {
    this.runwayForm.patchValue(this.runwaySelected);
    this.runwayDetailTitle = this.EDIT_RUNWAY_TITLE;
    this.initializeModal(this.runwayDetailModal);
    this.modalService.openModal();
  };

  private deleteRunway = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private barButtonActions = {
    new: this.newRunway,
    edit: this.editRunway,
    delete_selected: this.deleteRunway,
    search: this.toggleSearchBar,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onSaveRunway(newRunway: Track) {
    const saveRunway: Observable<Track> = newRunway.id
      ? this.runwaysService.editTrack(this.airportId, newRunway)
      : this.runwaysService.addTrack(this.airportId, newRunway);
    saveRunway.subscribe((data: Track) => {
      this.runwaySelected = data;
      this.refreshRunwaysTableData(this.airportId);
    });
  }

  public onConfirmDeleteRunway() {
    this.runwaysService.deleteTrack(this.airportId, this.runwaySelected).subscribe(() => this.refreshRunwaysTableData(this.airportId));
  }

  public onFilterRunways(runwayFilter: ColumnFilter) {
    const filter = {};
    filter[runwayFilter.identifier] = runwayFilter.searchTerm;
    console.log('FILTER BY', filter);
    this.runwayAdvancedSearchForm.patchValue(filter);
    this.filterRunwayTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.runwayAdvancedSearchForm.patchValue({ name: searchTerm });
    console.log('FILTER MOBILE BY', this.runwayAdvancedSearchForm.value);
    this.filterRunwayTable();
  }

  public onMobileAdvancedSearch() {
    console.log('ADVANCED FILTER BY', this.runwayAdvancedSearchForm.value);
    this.filterRunwayTable();
  }

  public onSortRunways(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.runwaySortForm.patchValue({ sort: sort });
    console.log('DESKTOP SORTING', this.runwaySortForm.value);
    this.filterRunwayTable();
  }

  public onMobileSort() {
    console.log('MOBILE SORTING', this.runwaySortForm.value);
    this.filterRunwayTable();
  }

  private filterRunwayTable() {
    const filter = {
      ...this.runwayAdvancedSearchForm.value,
      ...this.runwaySortForm.value,
    };
    // this.refreshRunwaysTableData(this.aiportId, filter);
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.runwayAdvancedSearchModal);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.runwaySortMenuModal);
    this.modalService.openModal();
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
