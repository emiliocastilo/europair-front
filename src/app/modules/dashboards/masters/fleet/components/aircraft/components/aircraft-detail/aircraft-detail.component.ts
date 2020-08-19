import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin, combineLatest } from 'rxjs';
import { takeUntil, combineAll } from 'rxjs/operators';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import {
  Aircraft,
  AircraftBase,
  EMPTY_AIRCRAFT,
} from '../../models/Aircraft.model';
import { AircraftTableAdapterService } from '../../services/aircraft-table-adapter.service';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-aircraft-detail',
  templateUrl: './aircraft-detail.component.html',
  styleUrls: ['./aircraft-detail.component.scss'],
  providers: [AircraftTableAdapterService],
})
export class AircraftDetailComponent implements OnInit {
  public pageTitle: string;

  private unsubscribe$: Subject<void> = new Subject();

  public readonly selectItemValue: string = 'id';
  public readonly selectItemDescription: string = 'name';

  public aircraftBaseColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftBaseColumnsData: RowDataModel[] = [];
  public aircraftBaseColumnsPagination: PaginationModel;

  public aircraftObservationsColumnsHeader: ColumnHeaderModel[] = [];
  public aircraftObservationsColumnsData: RowDataModel[] = [];
  public aircraftObservationsColumnsPagination: PaginationModel;

  public aircraftDetail: Aircraft = { ...EMPTY_AIRCRAFT };

  public operators: any[] = [];
  public aircraftTypes: any[] = [];

  public bases: AircraftBase[] = [];
  public observations: any[] = [];

  public aircraftForm = this.fb.group({
    operator: [''],
    quantity: ['', Validators.required],
    aircraftType: [''],
    insuranceEndDate: ['', Validators.required],
    productionYear: ['', Validators.required],
    plateNumber: ['', Validators.required],
    ambulance: [false, Validators.required],
    bases: [''],
    daytimeConfiguration: [0, [Validators.min(1), Validators.required]],
    seatingF: [0, Validators.min(0)],
    seatingC: [0, Validators.min(0)],
    seatingY: [0, Validators.min(0)],
    nighttimeConfiguration: [0, [Validators.min(1), Validators.required]],
    insideUpgradeYear: ['', Validators.required],
    outsideUpgradeYear: ['', Validators.required],
    observations: [''],
  });

  constructor(
    private fb: FormBuilder,
    private aircraftService: AircraftService,
    private aircraftTableAdapter: AircraftTableAdapterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAircraftData(this.route.snapshot.data);
    this.subscribeDaytimeConfiguration();
    this.initializeTablesColumnsHeader();
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
      dayTime.setValue(+F + +C + +Y);
    });
    this.updateAircraftForm(this.aircraftDetail);
  }

  private initializeAircraftData({ title, isAircraftDetail }: any) {
    this.pageTitle = title;
    if (isAircraftDetail) {
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ aircraftId }) => {
          this.retrieveAircraftData(aircraftId);
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
      operator: selectedAircraft.operator,
      quantity: selectedAircraft.quantity,
      aircraftType: selectedAircraft.aircraftType,
      insuranceEndDate: selectedAircraft.insuranceEndDate,
      productionYear: selectedAircraft.productionYear,
      plateNumber: selectedAircraft.plateNumber,
      ambulance: selectedAircraft.ambulance,
      bases: selectedAircraft.bases || [],
      daytimeConfiguration: selectedAircraft.daytimeConfiguration,
      nighttimeConfiguration: selectedAircraft.nighttimeConfiguration,
      observations: selectedAircraft.observations || [],
      insideUpgradeYear: selectedAircraft.insideUpgradeYear,
      outsideUpgradeYear: selectedAircraft.outsideUpgradeYear,
      seatingF: selectedAircraft.seatingF,
      seatingC: selectedAircraft.seatingC,
      seatingY: selectedAircraft.seatingY,
    });
  }

  public onSaveAircraft() {
    console.log({
      ...this.aircraftDetail,
      ...this.aircraftForm.value,
    });
    this.aircraftService
      .saveAircraft({
        ...this.aircraftDetail,
        ...this.aircraftForm.value,
      })
      .subscribe(() => {
        this.router.navigate(['fleet/aircraft']);
      });
  }

  // public onSaveAircraft(newAircraft: Aircraft) {
  //   // TODO: utilizar datepickers para las propiedades que son fechas
  //   newAircraft.insuranceEndDate = new Date(newAircraft.insuranceEndDate);
  //   newAircraft.insideUpgradeYear = new Date(newAircraft.insideUpgradeYear);
  //   newAircraft.outsideUpgradeYear = new Date(newAircraft.outsideUpgradeYear);
  //   // TODO: enlazar con operadores y tipos
  //   newAircraft.aircraft = 10;
  //   newAircraft.aircraftType = 10;

  //   this.aircraftService
  //     .saveAircraft(newAircraft)
  //     .subscribe(() => this.initializeAircraftTable());
  // }

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
}
