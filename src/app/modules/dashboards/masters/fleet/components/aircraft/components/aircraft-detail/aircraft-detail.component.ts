import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { Aircraft, AircraftBase, EMPTY_AIRCRAFT, AircraftObservation } from '../../models/Aircraft.model';
import { AircraftTableAdapterService } from '../../services/aircraft-table-adapter.service';
import { AircraftService } from '../../services/aircraft.service';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
import { OperatorsService } from 'src/app/modules/dashboards/masters/operators/services/operators.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { BarButton, BarButtonType } from 'src/app/core/models/menus/button-bar/bar-button';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { ObservationDetailComponent } from './components/observation-detail/observation-detail.component';
import { BaseDetailComponent } from './components/base-detail/base-detail.component';
import { FleetType } from '../../../../models/fleet';
import { FleetTypesService } from '../../../fleet-types/services/fleet-types.service';

@Component({
  selector: 'app-aircraft-detail',
  templateUrl: './aircraft-detail.component.html',
  styleUrls: ['./aircraft-detail.component.scss'],
  providers: [AircraftTableAdapterService],
})
export class AircraftDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ObservationDetailComponent, { static: true, read: ElementRef })
  public observationDetailModal: ElementRef;

  @ViewChild(BaseDetailComponent, { static: true, read: ElementRef })
  public baseDetailModal: ElementRef;

  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  public confirmDeleteModal: ElementRef;
  public deleteModalText: string;
  public deleteModalAction: any;

  public modalDetailTitle: string;
  private readonly EDIT_BASE_TITLE = 'Editar base';
  private readonly CREATE_BASE_TITLE = 'Crear base';
  private readonly EDIT_OBSERVATION_TITLE = 'Editar observación';
  private readonly CREATE_OBSERVATION_TITLE = 'Crear observación';

  public pageTitle: string;
  public isAircraftDetail = false;
  private unsubscribe$: Subject<void> = new Subject();

  public readonly selectItemValue: string = 'id';
  public readonly selectItemDescription: string = 'name';
  public readonly selectItemDescriptionFleetType: string = 'description';

  public aircraftBaseColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftBaseColumnsData: RowDataModel[] = [];
  public aircraftBaseColumnsPagination: PaginationModel;

  public aircraftObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftObservationsColumnsData: RowDataModel[] = [];
  public aircraftObservationsColumnsPagination: PaginationModel;

  public aircraftDetail: Aircraft = { ...EMPTY_AIRCRAFT };

  public operators: Operator[] = [];
  public aircraftTypes: FleetType[] = [];

  public bases: AircraftBase[] = [];
  public modeEdit: boolean = false;
  public observations: any[] = [];

  minSeats: number;

  public aircraftBaseSelected: AircraftBase;
  public aircraftBaseSelectedCount = 0;
  public aircraftBaseBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nueva' },
    { type: BarButtonType.EDIT, text: 'Editar' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];
  private aircraftBaseTableActions = {
    new: this.newAircraftBase,
    edit: this.editAircraftBase,
    delete_selected: this.deleteAircraftBase,
  };

  public aircraftObsSelected: AircraftObservation;
  public aircraftObsSelectedCount = 0;
  public aircraftObsBarButtons: BarButton[] = [
    { type: BarButtonType.NEW, text: 'Nuevo' },
    { type: BarButtonType.EDIT, text: 'Editar' },
    { type: BarButtonType.DELETE_SELECTED, text: 'Borrar' },
  ];
  private aircraftObsTableActions = {
    new: this.newAircraftObservation,
    edit: this.editAircraftObservation,
    delete: this.deleteAircraftObservation,
  };

  public aircraftForm = this.fb.group({
    operator: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    aircraftType: [null, Validators.required],
    insuranceEndDate: [''],
    productionYear: [''],
    plateNumber: [''],
    ambulance: [false, Validators.required],
    bases: [''],
    daytimeConfiguration: [''],
    seatingF: [''],
    seatingC: [''],
    seatingY: [''],
    nighttimeConfiguration: [''],
    insideUpgradeYear: [''],
    outsideUpgradeYear: [''],
    observations: [''],
  });

  public aircraftBaseForm = this.fb.group({
    airport: ['', Validators.required],
    mainBase: ['', Validators.required]
  });

  public aircraftObservationForm = this.fb.group({
    observation: ['', Validators.required],
  });

  private readonly aircraftBaseFormDefaultValues = {
    id: null,
    airport: null,
    mainBase: false
  } as const;

  public sameBaseIsMain: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private aircraftService: AircraftService,
    private operatorsService: OperatorsService,
    private fleetTypeService: FleetTypesService,
    private aircraftTableAdapter: AircraftTableAdapterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscribeDaytimeConfiguration();
    this.initializeOperators();
    this.initializeFleetType();
    this.initializeAircraftData(this.route.snapshot.data);
    this.initializeTablesColumnsHeader();
    this.updateAircraftForm(this.aircraftDetail);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeTablesColumnsHeader() {
    this.aircraftBaseColumnsHeader = this.aircraftTableAdapter.getAircraftBaseColumnsHeader();
    this.aircraftObservationsColumnsHeader = this.aircraftTableAdapter.getAircraftObservationsColumnsHeader();
  }

  private subscribeDaytimeConfiguration() {
    const dayTime = this.aircraftForm.get('daytimeConfiguration');
    dayTime.disable();
    combineLatest([
      this.aircraftForm.get('seatingF').valueChanges,
      this.aircraftForm.get('seatingC').valueChanges,
      this.aircraftForm.get('seatingY').valueChanges,
    ]).subscribe(([F, C, Y]) => {
      dayTime.setValue(String(+F + +C + +Y));
      if (+dayTime.value === 1) {
        this.minSeats = 1;
      } else {
        this.minSeats = 0;
      }
    });
  }

  private initializeAircraftBaseTable(aircraftId: number) {
    this.aircraftService
      .getAircraftBases(aircraftId)
      .subscribe((aircraftBasePage) => {
        this.getAircraftBaseTableData(aircraftBasePage);
      });
  }

  private initializeAircraftObservationTable(aircraftId: number) {
    this.aircraftService
      .getAircraftObservations(aircraftId)
      .subscribe((aircraftObservationPage) => {
        this.getAircraftObservationsTableData(aircraftObservationPage);
      });
  }

  private getAircraftBaseTableData(aircraftBasePage: Page<AircraftBase>) {
    this.bases = aircraftBasePage.content;
    this.sameBaseIsMain = this.bases.find((base: AircraftBase) => base.mainBase) !== undefined;
    this.aircraftBaseColumnsData = this.aircraftTableAdapter.getAircraftBaseTableData(aircraftBasePage.content);
    this.aircraftBaseColumnsPagination = this.initializeClientTablePagination(this.aircraftBaseColumnsData);
  }

  private getAircraftObservationsTableData(
    aircraftObservationPage: Page<AircraftObservation>
  ) {
    this.observations = aircraftObservationPage.content;
    this.aircraftObservationsColumnsData = this.aircraftTableAdapter.getAircraftObservationsTableData(
      aircraftObservationPage.content
    );
    this.aircraftObservationsColumnsPagination = this.initializeClientTablePagination(
      this.aircraftBaseColumnsData
    );
  }

  private initializeOperators() {
    this.operatorsService
      .getOperators({ size: '3000'})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((operatorPage: Page<Operator>) => {
        this.operators = operatorPage.content;
      });
  }

  private initializeFleetType() {
    this.fleetTypeService.getFleetTypes({filter_removedAt: null, size: '3000'}).subscribe(
      (fleetTypes: Page<FleetType>) => this.aircraftTypes = fleetTypes.content);
  }

  private initializeAircraftData({ title, isAircraftDetail }: any) {
    this.pageTitle = title;
    if (isAircraftDetail) {
      this.isAircraftDetail = true;
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ aircraftId }) => {
          this.retrieveAircraftData(aircraftId);
          this.initializeAircraftBaseTable(aircraftId);
          this.initializeAircraftObservationTable(aircraftId);
        });
    }
  }

  private retrieveAircraftData(aircraftId: number) {
    this.aircraftService
      .getAircraftById(aircraftId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((aircraftData: Aircraft) => {
        this.aircraftDetail = { ...EMPTY_AIRCRAFT, ...aircraftData };
        this.updateAircraftForm(this.aircraftDetail);
      });
  }

  private updateAircraftForm(selectedAircraft: Aircraft) {
    this.aircraftForm.setValue({
      operator: selectedAircraft.operator?.id ?? null,
      quantity: selectedAircraft.quantity,
      aircraftType: selectedAircraft.aircraftType?.id || null,
      insuranceEndDate: selectedAircraft.insuranceEndDate,
      productionYear: selectedAircraft.productionYear,
      plateNumber: selectedAircraft.plateNumber,
      ambulance: selectedAircraft.ambulance,
      bases: selectedAircraft.bases || [],
      daytimeConfiguration: String(selectedAircraft.daytimeConfiguration),
      nighttimeConfiguration: String(selectedAircraft.nighttimeConfiguration),
      observations: selectedAircraft.observations || [],
      insideUpgradeYear: selectedAircraft.insideUpgradeYear,
      outsideUpgradeYear: selectedAircraft.outsideUpgradeYear,
      seatingF: String(selectedAircraft.seatingF),
      seatingC: String(selectedAircraft.seatingC),
      seatingY: String(selectedAircraft.seatingY),
    });
  }

  public onBaseBarButtonClicked(barButtonType: BarButtonType) {
    this.aircraftBaseTableActions[barButtonType].bind(this)();
  }

  public onAircraftBaseSelected(baseIndex: number): void {
    this.aircraftBaseSelected = this.bases[baseIndex];
    this.aircraftBaseSelectedCount = 1;
  }

  public onObsBarButtonClicked(barButtonType: BarButtonType) {
    this.aircraftObsTableActions[barButtonType].bind(this)();
  }

  public onAircraftObsSelected(baseIndex: number): void {
    this.aircraftObsSelected = this.observations[baseIndex];
    this.aircraftObsSelectedCount = 1;
  }

  private newAircraftBase() {
    this.modalDetailTitle = this.CREATE_BASE_TITLE;
    this.modeEdit = false;
    this.aircraftBaseForm.reset(this.aircraftBaseFormDefaultValues);
    this.initializeModal(this.baseDetailModal);
    this.modalService.openModal();
  }

  private editAircraftBase(selectedItem: number): void {
    this.modalDetailTitle = this.EDIT_BASE_TITLE;
    this.modeEdit = true;
    this.aircraftBaseForm.reset({
      airport: this.aircraftBaseSelected.airport?.id,
      mainBase: this.aircraftBaseSelected.mainBase
    });
    this.initializeModal(this.baseDetailModal);
    this.modalService.openModal();
  }

  private deleteAircraftBase(selectedItem: number) {
    this.deleteModalText = '¿Está seguro que desea eliminar la base?';
    this.deleteModalAction = this.onConfirmDeleteBase;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  private newAircraftObservation() {
    this.modalDetailTitle = this.CREATE_OBSERVATION_TITLE;
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  }

  private editAircraftObservation(selectedItem: number): void {
    this.modalDetailTitle = this.EDIT_OBSERVATION_TITLE;
    this.initializeModal(this.observationDetailModal);
    this.modalService.openModal();
  }

  private deleteAircraftObservation(selectedItem: number) {
    this.deleteModalText = '¿Está seguro que desea eliminar la observación?';
    this.deleteModalAction = this.onConfirmDeleteObservation;
    this.initializeModal(this.confirmDeleteModal);
    this.modalService.openModal();
  }

  public onSaveAircraft() {
    console.log({
      ...this.aircraftDetail,
      ...this.aircraftForm.value,
    });
    const fleetTypeSelected: FleetType = this.getFleetTypeSelected();
    const operatorSelected: Operator = this.getAircraftOperatorSelected();
    const baseSelected: Array<AircraftBase> = this.getAircraftBaseSelected();
    this.aircraftService
      .saveAircraft({
        ...this.aircraftDetail,
        ...this.aircraftForm.value,
        aircraftType: fleetTypeSelected,
        operator: operatorSelected,
        bases: baseSelected
      })
      .subscribe(() => {
        this.router.navigate(['fleet/aircraft']);
      });
  }

  private getFleetTypeSelected(): FleetType {
    const fleetTypeId: number = this.aircraftForm.get('aircraftType').value;
    return this.aircraftTypes.find((fleetType: FleetType) => fleetTypeId === fleetType.id);
  }

  private getAircraftBaseSelected(): Array<AircraftBase> {
    const base: Array<AircraftBase> = [];
    if (this.aircraftForm.get('bases') && this.aircraftForm.get('bases').value) {
      const baseId: number = this.aircraftForm.get('bases').value;
      base.push(this.bases.find((base: AircraftBase) => baseId === base.id));
    }
    return base;
  }

  private getAircraftOperatorSelected(): Operator {
    const operatorId: number = this.aircraftForm.get('operator').value;
    return this.operators.find((operator: Operator) => operatorId === operator.id);
  }

  public onSaveBase(newBase: AircraftBase) {
    if (newBase.id) {
      this.aircraftBaseSelected = newBase;
    }
    this.aircraftService
      .saveAircraftBase(this.aircraftDetail.id, newBase)
      .subscribe((data: AircraftBase) => {
        this.initializeAircraftBaseTable(this.aircraftDetail.id);
      });
  }

  public onSaveObservation(newObservation: AircraftObservation) {
    this.aircraftService
      .saveAircraftObservation(this.aircraftDetail.id, newObservation)
      .subscribe((data: AircraftObservation) => {
        console.log(data);
        // this.refreshRunwaysTableData(this.airportId)
      });
  }

  public onConfirmDeleteBase() {
    this.aircraftService
      .removeAircraftBase(this.aircraftDetail.id, this.aircraftBaseSelected.id)
      .subscribe(() => this.initializeAircraftBaseTable(this.aircraftDetail.id));
  }

  public onConfirmDeleteObservation() {
    this.aircraftService
      .removeAircraftObservation(
        this.aircraftDetail.id,
        this.aircraftObsSelected.id
      )
      .subscribe(() => { });
  }

  public searchOperator(term: string, operator: Operator) {
    term = term.toLowerCase();
    return (
      operator.name.toLowerCase().indexOf(term) > -1 ||
      operator.iataCode.toLowerCase() === term
    );
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.aircraftForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.aircraftForm.get(controlName);
    return control && control.hasError(errorName);
  }

  private initializeClientTablePagination(
    model: RowDataModel[]
  ): PaginationModel {
    const pagination = this.aircraftTableAdapter.getPagination();
    pagination.lastPage = model.length / pagination.elementsPerPage;
    return pagination;
  }

  private initializeModal(modalContainer: ElementRef): void {
    this.modalService.initializeModal(modalContainer, {
      dismissible: false,
    });
  }
}
