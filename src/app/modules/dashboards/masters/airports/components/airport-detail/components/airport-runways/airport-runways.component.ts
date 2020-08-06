import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ColumnHeaderModel } from 'src/app/core/models/table/column-header.model';
import { AirportRunwaysTableAdapterService } from './services/airport-runways-table-adapter.service';
import {
  BarButton,
  BarButtonType,
} from 'src/app/core/models/menus/button-bar/bar-button';
import { RowDataModel } from 'src/app/core/models/table/row-data.model';
import { RunwaysService } from '../../../../services/runways.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Track } from '../../../../models/airport';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { AirportRunwayDetailComponent } from './components/airport-runways-detail/airport-runway-detail.component';
import { MeasureType } from 'src/app/core/models/base/measure';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';

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

  private readonly EDIT_RUNWAY_TITLE = 'Editar pista';
  private readonly CREATE_RUNWAY_TITLE = 'Crear pista';
  private readonly runwayFormDefaultValues = {
    id: null,
    main: false,
    length: {
      value: '',
      type: null,
    },
    width: {
      value: '',
      type: null,
    },
    observation: '',
  };

  private unsubscriber$: Subject<void> = new Subject();
  public airportId: string;
  public runwaysColumnsHeader: ColumnHeaderModel[];
  public runwaysColumnsData: RowDataModel[];
  public runwaysPagination: PaginationModel;
  public runwaySelected: Track;
  private runways: Track[];
  public runwaysSelectedCount: number = 0;
  public runwayDetailTitle: string;
  public runwaysBarButtons: BarButton[] = [
    { text: 'Nueva', type: BarButtonType.NEW },
    { text: 'Eliminar', type: BarButtonType.DELETE_SELECTED },
    { text: 'Editar', type: BarButtonType.EDIT },
  ];

  public runwayForm = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    main: [false],
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
        this.refreshhRunwaysTableData(params.airportId)
      );
  }

  private refreshhRunwaysTableData(airportId: string): void {
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
      lastPage: runways.content.length / this.runwaysPagination.elememtsPerpage,
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

  private barButtonActions = {
    new: this.newRunway,
    edit: this.editRunway,
    delete_selected: this.deleteRunway,
  };

  public onBarButtonClicked(barButtonType: BarButtonType) {
    this.barButtonActions[barButtonType]();
  }

  public onSaveRunway(newRunway: Track) {
    newRunway.id
      ? console.log('EDITING RUNWAY', newRunway)
      : console.log('CREATING RUNWAY', newRunway);
    this.refreshhRunwaysTableData(this.airportId);
  }

  public onConfirmDeleteRunway() {
    console.log('DELETING RUNWAY', this.runwaySelected);
    this.refreshhRunwaysTableData(this.airportId);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
