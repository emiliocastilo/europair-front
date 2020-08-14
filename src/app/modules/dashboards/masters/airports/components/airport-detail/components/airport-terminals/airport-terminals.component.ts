import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { Subject } from 'rxjs';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { Terminal } from '../../../../models/airport';
import { ColumnFilter } from 'src/app/core/models/table/columns/column-filter';
import { SortByColumn } from 'src/app/core/models/table/sort-button/sort-by-column';
import { AirportTerminalsTableAdapterService } from './services/airport-terminals-table-adapter.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { tap, takeUntil } from 'rxjs/operators';
import { TerminalsService } from '../../../../services/terminals.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { AirportTerminalDetailComponent } from './components/airport-terminal-detail/airport-terminal-detail.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { AdvancedSearchComponent } from 'src/app/core/components/menus/advanced-search/advanced-search.component';
import { SortMenuComponent } from 'src/app/core/components/menus/sort-menu/sort-menu.component';

@Component({
  selector: 'app-airport-terminals',
  templateUrl: './airport-terminals.component.html',
  styleUrls: ['./airport-terminals.component.scss'],
  providers: [AirportTerminalsTableAdapterService],
})
export class AirportTerminalsComponent implements OnInit {
  @ViewChild(AirportTerminalDetailComponent, { static: true, read: ElementRef })
  public terminalDetailModal: ElementRef;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  @ViewChild(AdvancedSearchComponent, { static: true, read: ElementRef })
  public terminalAdvancedSearchModal: ElementRef;
  @ViewChild(SortMenuComponent, { static: true, read: ElementRef })
  public terminalSortMenuModal: ElementRef;

  private readonly EDIT_TERMINAL_TITLE = 'Editar terminal';
  private readonly CREATE_TERMINAL_TITLE = 'Crear terminal';

  private readonly terminalFormDefaultValues = {
    id: null,
    code: '',
    name: '',
    observation: '',
  } as const;

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public terminalsColumnsHeader: ColumnHeaderModel[];
  public terminalsColumnsData: RowDataModel[];
  public terminalsPagination: PaginationModel;
  public terminalSelected: Terminal;
  private terminals: Terminal[];
  public terminalDetailTitle: string;
  private terminalFilter: any = {};
  public showMobileSearchBar: boolean = false;
  public terminalsSelectedCount: number = 0;
  public terminalsBarButtons: BarButton[] = [
    { text: 'Nueva', type: BarButtonType.NEW },
    { text: 'Filtrar', type: BarButtonType.SEARCH },
    { text: 'Editar', type: BarButtonType.EDIT },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
  ];

  public terminalAdvancedSearchForm = this.fb.group({
    code: [''],
    name: [''],
  });

  public terminalSortForm = this.fb.group({
    sort: [''],
  });

  public terminalForm = this.fb.group({
    id: [null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    observation: [''],
  });

  constructor(
    private terminalsTableAdapter: AirportTerminalsTableAdapterService,
    private terminalsService: TerminalsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initAirportTerminals();
    this.terminalsPagination = this.terminalsTableAdapter.getPagination();
    this.terminalsColumnsHeader = this.terminalsTableAdapter.getTerminalsColumnsHeader();
  }

  private initAirportTerminals(): void {
    this.route.params
      .pipe(
        tap((params) => (this.airportId = params.airportId)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((params: Params) =>
        this.refreshTerminalsTableData(params.airportId)
      );
  }

  private refreshTerminalsTableData(airportId: string): void {
    this.terminalsService
      .getAirportTerminals(airportId)
      .pipe(tap(this.getTerminals))
      .subscribe(
        (terminals: Page<Terminal>) =>
          (this.terminalsColumnsData = this.terminalsTableAdapter.getTerminalsTableData(
            terminals.content
          ))
      );
  }

  private getTerminals = (terminals: Page<Terminal>): void => {
    this.terminalsPagination = {
      ...this.terminalsPagination,
      lastPage:
        terminals.content.length / this.terminalsPagination.elementsPerPage,
    };
    this.terminals = terminals.content;
  };

  private newTerminal = () => {
    this.terminalForm.reset(this.terminalFormDefaultValues);
    this.terminalDetailTitle = this.CREATE_TERMINAL_TITLE;
    this.initializeModal(this.terminalDetailModal);
    this.modalService.openModal();
  };

  private editTerminal = () => {
    this.terminalForm.patchValue(this.terminalSelected);
    this.terminalDetailTitle = this.EDIT_TERMINAL_TITLE;
    this.initializeModal(this.terminalDetailModal);
    this.modalService.openModal();
  };

  private deleteTerminal = () => {
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  };

  private toggleSearchBar = () => {
    this.showMobileSearchBar = !this.showMobileSearchBar;
  };

  private barButtonActions = {
    new: this.newTerminal,
    edit: this.editTerminal,
    delete_selected: this.deleteTerminal,
    search: this.toggleSearchBar,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onTerminalSelected(terminalIndex: number): void {
    this.terminalSelected = this.terminals[terminalIndex];
    this.terminalsSelectedCount = 1;
  }

  public onSaveTerminal(newTerminal: Terminal) {
    newTerminal.id
      ? console.log('EDITING TERMINAL', newTerminal)
      : console.log('CREATING TERMINAL', newTerminal);
    this.refreshTerminalsTableData(this.airportId);
  }

  public onConfirmDeleteTerminal() {
    console.log('DELETING TERMINAL', this.terminalSelected);
    this.refreshTerminalsTableData(this.airportId);
  }

  public onMobileBasicSearch(searchTerm: string) {
    this.terminalAdvancedSearchForm.patchValue({ name: searchTerm });
    console.log('FILTER MOBILE BY', this.terminalAdvancedSearchForm.value);
    this.filterTerminalTable();
  }

  public onFilterTerminals(filter: ColumnFilter) {
    this.terminalFilter[filter.identifier] = filter.searchTerm;
    console.log('FILTER BY', this.terminalFilter);
    this.terminalAdvancedSearchForm.patchValue(this.terminalFilter);
    this.filterTerminalTable();
  }

  public onSortTerminals(sortByColumn: SortByColumn) {
    const sort = sortByColumn.column + ',' + sortByColumn.order;
    this.terminalSortForm.patchValue({ sort: sort });
    console.log('DESKTOP SORTING', this.terminalSortForm.value);
    this.filterTerminalTable();
  }

  public onMobileSort() {
    console.log('MOBILE SORTING', this.terminalSortForm.value);
    this.filterTerminalTable();
  }

  public onMobileAdvancedSearch() {
    console.log('ADVANCED FILTER BY', this.terminalAdvancedSearchForm.value);
    this.filterTerminalTable();
  }

  private filterTerminalTable() {
    const filter = {
      ...this.terminalAdvancedSearchForm.value,
      ...this.terminalSortForm.value,
    };
    // this.refreshRunwaysTableData(this.aiportId, filter);
  }

  public onOpenAdvancedSearch() {
    this.initializeModal(this.terminalAdvancedSearchModal);
    this.modalService.openModal();
  }

  public onOpenSortMenu() {
    this.initializeModal(this.terminalSortMenuModal);
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
