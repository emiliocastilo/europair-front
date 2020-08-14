import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { Subject } from 'rxjs';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Region } from 'src/app/modules/dashboards/masters/regions/models/region';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportRegionsTableAdapterService } from './services/airport-regions-table-adapter.service';
import { tap, takeUntil } from 'rxjs/operators';
import { AirportRegionsService } from '../../../../services/airport-regions.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { FormBuilder } from '@angular/forms';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';
import { AirportRegionEditorComponent } from './components/airport-region-editor/airport-region-editor.component';

@Component({
  selector: 'app-airport-regions',
  templateUrl: './airport-regions.component.html',
  styleUrls: ['./airport-regions.component.scss'],
})
export class AirportRegionsComponent implements OnInit, OnDestroy {
  @ViewChild(AirportRegionEditorComponent, { static: true, read: ElementRef })
  public regionEditorModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public regionAdvancedSearchModal: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public regionSortMenuModal: ElementRef;

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public regionsColumnsHeader: ColumnHeaderModel[];
  public regionsColumnsData: RowDataModel[];
  public regionsPagination: PaginationModel;
  public regionSelected: Region;
  public regions: Region[];
  private regionFilter: any = {};
  public showMobileSearchBar: boolean = false;
  public regionsSelectedCount: number = 0;
  public regionsBarButtons: BarButton[] = [
    { text: 'Añadir', type: BarButtonType.NEW },
    { text: 'Filtrar', type: BarButtonType.SEARCH },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  public regionAdvancedSearchForm = this.fb.group({
    code: [''],
    name: [''],
  });

  public regionSortForm = this.fb.group({
    sort: [''],
  });

  constructor(
    private airportRegionsService: AirportRegionsService,
    private regionsTableAdapterService: AirportRegionsTableAdapterService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initAirportRegions();
    this.regionsPagination = this.regionsTableAdapterService.getPagination();
    this.regionsColumnsHeader = this.regionsTableAdapterService.getRegionsColumnsHeader();
  }

  private initAirportRegions(): void {
    this.route.params
      .pipe(
        tap((params) => (this.airportId = params.airportId)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((params: Params) =>
        this.refreshRegionsTableData(params.airportId)
      );
  }

  private refreshRegionsTableData(airportId: string): void {
    this.airportRegionsService
      .getAirportRegions(airportId)
      .pipe(tap(this.getRegions))
      .subscribe(
        (regions: Page<Region>) =>
          (this.regionsColumnsData = this.regionsTableAdapterService.getRegionsTableData(
            regions.content
          ))
      );
  }

  private getRegions = (regions: Page<Region>): void => {
    this.regionsPagination = {
      ...this.regionsPagination,
      lastPage: regions.content.length / this.regionsPagination.elementsPerPage,
    };
    this.regions = regions.content;
  };

  private addRegion = () => {
    this.initializeModal(this.regionEditorModal);
    this.modalService.openModal();
  };

  private deleteRegion = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private barButtonActions = {
    new: this.addRegion,
    delete_selected: this.deleteRegion,
    search: this.toggleSearchBar,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onRegionSelected(regionIndex: number): void {
    this.regionSelected = this.regions[regionIndex];
    this.regionsSelectedCount = 1;
  }

  public onAddRegions(regionsToAdd: Region[]): void {
    console.log('ADDING REGION TO AIRPORT', regionsToAdd);
  }

  public onConfirmDeleteRegion(): void {
    console.log('DELETING REGION', this.regionSelected);
    this.refreshRegionsTableData(this.airportId);
  }

  public onFilterRegions(filter: ColumnFilter) {
    this.regionFilter[filter.identifier] = filter.searchTerm;
    console.log('FILTER BY', this.regionFilter);
    this.regionAdvancedSearchForm.patchValue(this.regionFilter);
    this.filterRegionTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.regionAdvancedSearchForm.patchValue({ name: searchTerm });
    console.log('FILTER MOBILE BY', this.regionAdvancedSearchForm.value);
    this.filterRegionTable();
  }

  public onSortRegions(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.regionSortForm.patchValue({ sort: sort });
    console.log('DESKTOP SORTING', this.regionSortForm.value);
    this.filterRegionTable();
  }

  public onMobileSort() {
    console.log('MOBILE SORTING', this.regionSortForm.value);
    this.filterRegionTable();
  }

  public onMobileAdvancedSearch() {
    console.log('ADVANCED FILTER BY', this.regionAdvancedSearchForm.value);
    this.filterRegionTable();
  }

  private filterRegionTable() {
    const filter = {
      ...this.regionAdvancedSearchForm.value,
      ...this.regionSortForm.value,
    };
    // this.refreshRegionsTableData(this.aiportId, filter);
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.regionAdvancedSearchModal);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.regionSortMenuModal);
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
