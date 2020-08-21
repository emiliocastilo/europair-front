import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Certification } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { AirportOperatorsTableAdapterService } from './services/airport-operators-table-adapter.service';
import { AirportOperatorsService } from '../../../../services/airport-operators.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { AirportCertifiedOperatorCreatorComponent } from './airport-certified-operator-creator/airport-certified-operator-creator.component';
import { AirportCertifiedOperatorEditorComponent } from './airport-certified-operator-editor/airport-certified-operator-editor.component';

@Component({
  selector: 'app-airport-certified-operators',
  templateUrl: './airport-certified-operators.component.html',
  styleUrls: ['./airport-certified-operators.component.scss'],
  providers: [AirportOperatorsTableAdapterService],
})
export class AirportCertifiedOperatorsComponent implements OnInit, OnDestroy {
  @ViewChild(AirportCertifiedOperatorCreatorComponent, {
    static: true,
    read: ElementRef,
  })
  public certifiedOperatorCreatorModal: ElementRef;
  @ViewChild(AirportCertifiedOperatorEditorComponent, {
    static: true,
    read: ElementRef,
  })
  public certifiedOperatorEditorModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public operatorAdvancedSearchModal: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public operatorSortMenuModal: ElementRef;

  private readonly certifiedOperatorFormDefaultValues = {
    id: null,
    comments: '',
  } as const;

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public operatorsColumnsHeader: ColumnHeaderModel[];
  public operatorsColumnsData: RowDataModel[];
  public operatorsPagination: PaginationModel;
  public operatorSelected: Certification;
  private certifiedOperators: Certification[];
  private operatorFilter: any = {};
  public showMobileSearchBar: boolean = false;
  public operatorsSelectedCount: number = 0;
  public operatorsBarButtons: BarButton[] = [
    { text: 'Añadir', type: BarButtonType.NEW },
    { text: 'Filtrar', type: BarButtonType.SEARCH },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  public certifiedOperatorForm = this.fb.group({
    id: [null],
    comments: ['', Validators.required],
  });

  constructor(
    private operatorsTableAdapterService: AirportOperatorsTableAdapterService,
    private operatorsService: AirportOperatorsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initAirportOperators();
    this.operatorsPagination = this.operatorsTableAdapterService.getPagination();
    this.operatorsColumnsHeader = this.operatorsTableAdapterService.getCertifiedOperatorsColumnsHeader();
  }

  private initAirportOperators(): void {
    this.route.params
      .pipe(
        tap((params) => (this.airportId = params.airportId)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((params: Params) =>
        this.refreshOperatorsTableData(params.airportId)
      );
  }

  private refreshOperatorsTableData(airportId: string): void {
    this.operatorsService
      .getAirportCertifiedOperators(airportId)
      .pipe(tap(this.getOperators))
      .subscribe(
        (certifiedOperators: Page<Certification>) =>
          (this.operatorsColumnsData = this.operatorsTableAdapterService.getCertifiedOperatorsTableData(
            certifiedOperators.content
          ))
      );
  }

  private getOperators = (certifiedOperators: Page<Certification>): void => {
    this.operatorsPagination = {
      ...this.operatorsPagination,
      lastPage:
        certifiedOperators.content.length /
        this.operatorsPagination.elementsPerPage,
    };
    this.certifiedOperators = certifiedOperators.content;
  };

  private addOperator = () => {
    this.certifiedOperatorForm.reset(this.certifiedOperatorFormDefaultValues);
    this.initializeModal(this.certifiedOperatorCreatorModal);
    this.modalService.openModal();
  };

  private editOperator = () => {
    this.certifiedOperatorForm.patchValue(this.operatorSelected);
    this.initializeModal(this.certifiedOperatorEditorModal);
    this.modalService.openModal();
  };

  private deleteOperator = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private barButtonActions = {
    new: this.addOperator,
    edit: this.editOperator,
    delete_selected: this.deleteOperator,
    search: this.toggleSearchBar,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onOperatorSelected(operatorIndex: number): void {
    this.operatorSelected = this.certifiedOperators[operatorIndex];
    this.operatorsSelectedCount = 1;
  }

  public onAddCertifiedOperator(newCertifiedOperator: Certification): void {
    this.operatorsService.addCertification(this.airportId, newCertifiedOperator)
      .subscribe((certification: Certification) =>
        this.refreshOperatorsTableData(this.airportId)
      );
  }

  public onEditCertifiedOperator(editedCertifiedOperator: Certification) {
    this.operatorsService.editCertification(this.airportId, editedCertifiedOperator)
      .subscribe((certification: Certification) =>
        this.refreshOperatorsTableData(this.airportId)
      );
  }

  public onConfirmDeleteOperator() {
    this.operatorsService.deleteCertification(this.airportId, this.operatorSelected)
      .subscribe(() => this.refreshOperatorsTableData(this.airportId));
  }

  public onFilterOperators(filter: ColumnFilter) {
    // this.observationFilter[filter.identifier] = filter.searchTerm;
    // console.log('FILTER BY', this.observationFilter);
    // this.observationAdvancedSearchForm.patchValue(this.observationFilter);
    // this.filterObservationTable();
  }

  public onSortOperators(sortByColumn: SortByColumn) {
    // const sort = sortByColumn.column + ',' + sortByColumn.order;
    // this.observationSortForm.patchValue({ sort: sort });
    // console.log('DESKTOP SORTING', this.observationSortForm.value);
    // this.filterObservationTable();
  }

  public onMobileBasicSearch(searchTerm: string) {
    // this.observationAdvancedSearchForm.patchValue({ observation: searchTerm });
    // console.log('FILTER MOBILE BY', this.observationAdvancedSearchForm.value);
    // this.filterObservationTable();
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.operatorAdvancedSearchModal);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.operatorSortMenuModal);
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
