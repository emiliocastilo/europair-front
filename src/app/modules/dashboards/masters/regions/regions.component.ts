import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Region, EMPTY_REGION } from './models/region';
import { RegionsService } from './services/regions.service';
import { RegionsTableAdapterService } from './services/regions-table-adapter.service';
import { RegionDetailComponent } from './components/region-detail/region-detail.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Validators, FormBuilder } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { TranslateService } from '@ngx-translate/core';
import { Page } from 'src/app/core/models/table/pagination/page';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SearchFilter } from 'src/app/core/models/search/search-filter';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent implements OnInit {
  @ViewChild(RegionDetailComponent, { static: true, read: ElementRef })
  public regionDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;

  public regionColumnsHeader: ColumnHeaderModel[] = [];
  public regionColumnsData: RowDataModel[] = [];
  public regionPagination: PaginationModel;
  public regions: Region[];
  public regionSelected: Region = EMPTY_REGION;
  public regionDetailTitle: string;
  private regionFilter: any = { page: 0 };

  public barButtons: BarButton[];

  public regionForm = this.fb.group({
    id: [null],
    code: ['', Validators.required],
    name: ['', Validators.required],
  });

  constructor(
    private regionsService: RegionsService,
    private regionsTableAdapterService: RegionsTableAdapterService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.obtainTranslateText();
    this.initializeRegionsTable(this.regionFilter);
    this.initializeTablesColumnsHeader();
  }

  private obtainTranslateText(): void {
    forkJoin({
      newRegion: this.translateService.get('REGIONS.NEW'),
      deleteRegion: this.translateService.get('REGIONS.DELETE')
    }).subscribe((data: {newRegion: string, deleteRegion: string}) => {
      this.barButtons = [
        { type: BarButtonType.NEW, text: data.newRegion },
        { type: BarButtonType.DELETE_SELECTED, text: data.deleteRegion }
      ];
    });
  }

  private initializeTablesColumnsHeader() {
    this.regionColumnsHeader = this.regionsTableAdapterService.getRegionColumnsHeader();
  }

  private initializeRegionsTable(searchFilter?: SearchFilter) {
    this.regionsService.getRegions(searchFilter).subscribe((data: Page<Region>) => this.getRegionTableData(data));
  }

  private getRegionTableData = (page: Page<Region>) => {
    this.regions = page.content;
    this.regionColumnsData = this.regionsTableAdapterService.getRegionTableDataFromRegions(this.regions);
    if (!this.regionPagination || this.regionPagination.lastPage !== page.totalPages) {
      this.regionPagination = this.regionsTableAdapterService.getPagination();
      this.regionPagination.lastPage = page.totalPages;
    }
  };

  private initializeModal(modalContainer: ElementRef) {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }


  private getNewRegionDetailData = (data: any) => {
    this.regionSelected = { ...EMPTY_REGION };
    this.regionForm.enable();
    this.regionForm.reset();
    this.getRegionDetailData(this.translateService.instant('REGIONS.CREATE'));
  };

  private barButtonActions = {
    new: this.getNewRegionDetailData,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onChangePage(page: number): void {
    if (page !== this.regionFilter['page']) {
      this.regionFilter['page'] = page;
      this.filterRegionTable();
    }
  }

  public onFilterRegions(regionFilter: ColumnFilter) {
    this.regionFilter[regionFilter.identifier] = regionFilter.searchTerm;
    this.filterRegionTable();
  }

  public onSortRegions(sortByColumn: SortByColumn) {
    this.regionFilter['sort'] = sortByColumn.column + ',' + sortByColumn.order;
    this.filterRegionTable();
  }

  private filterRegionTable(): void {
    this.initializeRegionsTable(this.regionFilter);
  }

  public onRegionAction(action: { actionId: string; selectedItem: number }) {
    this.regionSelected = { ...this.regions[action.selectedItem] };
    this.regionTableActions[action.actionId](action.selectedItem);
  }

  private getEditRegionDetailData = (data: any) => {
    this.updateRegionrForm(this.regionSelected);
    this.regionForm.enable();
    this.getRegionDetailData(this.translateService.instant('REGIONS.EDIT_REGION'));
  };

  private deleteRegion = (selectedItem: number) => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  public onConfirmDeleteRegion() {
    this.regionsService.deleteRegion(this.regionSelected).subscribe(() => this.filterRegionTable());
  }

  public onSaveRegion(newRegion: Region) {
    const saveRegion: Observable<Region> = newRegion.id === null ? this.regionsService.addRegion(newRegion) : this.regionsService.editRegion(newRegion);
    saveRegion.subscribe((region: Region) => this.filterRegionTable());
  }

  private regionTableActions = {
    edit: this.getEditRegionDetailData,
    delete: this.deleteRegion,
  };

  private getRegionDetailData = (regionDetailTitle: string) => {
    this.regionDetailTitle = regionDetailTitle;
    this.initializeModal(this.regionDetailModal);
    this.modalService.openModal();
  };

  private updateRegionrForm(selectedRegion: Region) {
    this.regionForm.setValue({
      id: selectedRegion.id,
      code: selectedRegion.code,
      name: selectedRegion.name
    });
  }
}
