import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  FileRoute,
  DAYS_LIST,
  FrequencyDay,
  RouteStatus,
} from '../../models/FileRoute.model';
import { FilesService } from '../../services/files.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FileRoutesService } from '../../services/file-routes.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ModalService } from 'src/app/core/components/modal/modal.service';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Client, File, FileStatus, FileStatusCode } from '../../models/File.model';
import { FileStatusService } from '../../services/file-status.service';
import { ClientsService } from '../../services/clients.service';
import { AdditionalServiceService } from '../../services/additional-services.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class FileErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

enum FileAction {
  CONFIRM_OPERATION = 'CONFIRM_OPERATION',
  CREATE_ROUTES = 'CREATE_ROUTES',
  CREATE_CONTRACT = 'CREATE_CONTRACT',
  MODIFY_FILE = 'MODIFY_FILE',
  SIGN_FILE = 'SIGN_FILE'
}
@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class FileDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) expandedTable: MatTable<any>;
  @ViewChild(ModalComponent, { static: true, read: ElementRef })
  private readonly confirmOperationModal: ElementRef;

  public fileData: File;
  public routes: Array<FileRoute>;
  public routeData$: Observable<Data>;
  public pageTitle: string; 

  public fileStatus: typeof FileStatusCode = FileStatusCode;
  public fileAction: typeof FileAction = FileAction;

  public columnsToDisplay = [
    'label',
    'frequency',
    'startDate',
    'endDate',
    'frequencyDays',
    'rotations.length',
    'seats',
    'periodDays',
    'dayNumber',
    'status',
    'actions',
  ];
  public columnsAdditionalServicesToDisplay = ['code', 'description', 'quantity', 'provider', 'purchasePrice', 'salePrice', 'tax', 'commision', 'comment', 'seller', 'status'];

  public dataSource = new MatTableDataSource();
  public dataSourceAdditionalService = new MatTableDataSource();
  public expandedElements: FileRoute[] = [];
  public resultsLength = 0;
  public pageSize = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;
  public observations: string;
  public observationMaxLength: number = 5000;
  public hasRoutes: boolean;

  public fileForm: FormGroup = this.fb.group({
    code: [{value: '', disabled: true}],
    description: [''],
    status: [''],
    client: ['', Validators.required],
    statusId: ['', this.validatorRequiredEditMode.bind(this)],
    clientId: ['', Validators.required]
  });

  public statusOptions: FileStatus[] = [];
  public clientOptions$: Observable<Client[]>;

  public matcher = new FileErrorStateMatcher();

  private isFileDetail: boolean;
  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private fileService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fileRoutesService: FileRoutesService,
    private fileStatusService: FileStatusService,
    private clientService: ClientsService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.loadClients();
    this.routeData$ = this.route.data.pipe(tap(this.initFileData));
  }

  // TODO: Improve client clientId relation
  private loadClients(): void {
    this.fileForm
      .get('client')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        if (typeof term === 'string') {
          this.clientOptions$ = term ? this.getFilteredClients(term) : of([]);
        } else {
          this.fileForm.get('clientId').setValue(term.id);
        }
      });
  }

  private getFilteredClients(term: string): Observable<Client[]> {
    const filter = {};
    return this.clientService.getClients(filter).pipe(
      map((page: Page<Client>) => page.content),
      map((response) =>
        response.filter((p) => {
          return (
            p.code.toUpperCase().includes(term.toUpperCase()) ||
            p.name.toUpperCase().includes(term.toUpperCase())
          );
        })
      )
    );
  }

  public getChildRoutes(fileRoute: FileRoute): MatTableDataSource<FileRoute> {
    return new MatTableDataSource(fileRoute.rotations);
  }

  public initFileData = ({ isFileDetail }): void => {
    this.isFileDetail = isFileDetail;
    if (isFileDetail) {
      this.route.params
        .pipe(
          switchMap((params: Params) =>
            this.fileService.getFileById(params.fileId)
          )
        )
        .subscribe((file: File) => {
          this.getFileData(file);
        });
    }
  };

  // TODO: fix general data inputs
  private getFileData(file: File): void {
    this.fileData = file;
    this.fileForm.patchValue({
      ...file,
      status: file.status?.id
    });

    this.loadStatus();
    this.loadFileRoutes(file);
  }

  private loadStatus(): void {
    this.fileStatusService.getAvailableStatus(this.fileData?.status)
      .subscribe((fileStatus: Page<FileStatus>) => this.statusOptions = fileStatus.content);
  }

  private loadFileRoutes(file: File) {
    this.fileRoutesService
      .getFileRoutes(file.id)
      .subscribe((data: Page<FileRoute>) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.routes = data.content;
        this.dataSource.sort = this.sort;
        this.resultsLength = data.totalElements;
        this.pageSize = data.size;
        this.hasRoutes = data.totalElements > 0;
      });
  }

  /**
  private obtainAdditionalServices(routeId: number, flightId: number): void {
    this.additionalServicesService.getAdditionalServices(this.fileData.id, routeId, flightId).subscribe((data: Page<Services>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }*/

  public onSaveFile(update: boolean) {
    if (this.fileForm.valid) {
      this.fileData = {
        ...this.fileData,
        ...this.fileForm.value,
      };

      const file: File = {
        clientId: this.fileForm.get('clientId').value,
        description: this.fileForm.get('description').value,
        contactId: 1,
        providerId: 1,
        salePersonId: 1,
        saleAgentId: 1,
        operationType: 'COMMERCIAL'
      };

      console.log('SAVING FILE', file);

      this.fileService.saveFile(file).subscribe((resp) => {
        if (!update) {
          this.router.navigate([`/files/${resp.id}`]);
        } else {
          this.fileService.getFileById(this.fileData.id).subscribe((resp: File) => this.getFileData(resp));
        }
      });
    }
  }

  public getRotationNumber(
    parentRoute: FileRoute,
    rotation: FileRoute
  ): string {
    const index = parentRoute.rotations.indexOf(rotation);
    return index === -1 ? '' : `${index + 1}`;
  }

  public getFormattedFrequency(frequencyDays: FrequencyDay[]): string {
    if (!frequencyDays) {
      return '';
    }
    const formattedWeek = [];
    const frequency = frequencyDays.map((elm) => elm.weekday);

    this.translateService
      .get('DAYS.ABBREVIATION')
      .subscribe((data: Array<string>) => {
        DAYS_LIST.forEach((dayName) => {
          formattedWeek.push(frequency.includes(dayName) ? data[dayName] : '-');
        });
      });
    return formattedWeek.join(' ');
  }

  public runAction(
    event: Event,
    isPlane: boolean = false,
    id: number = 0
  ): void {
    event.preventDefault();
    event.stopPropagation();
    if (isPlane) {
      this.router.navigate(['/files/search-aircraft', this.fileData.id, id]);
    }
  }

  public navigateToSearchAircraft(id: number) {
    this.router.navigate(['/files/search-aircraft', this.fileData.id, id]);
  }

  public editRotation(route: FileRoute, rotation: FileRoute) {
    this.router.navigate(['routes', route.id, 'rotations', rotation.id], {relativeTo: this.route})
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.fileForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.fileForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public expandRow(element: FileRoute) {
    const index: number = this.expandedElements.indexOf(element);
    index !== -1
      ? this.expandedElements.splice(index, 1)
      : this.expandedElements.push(element);
    setTimeout(() => {
      this.expandedTable.updateStickyColumnStyles();
    }, 1000);
  }
  
  public openConfirmOperationModal(): void {
    this.modalService.initializeModal(this.confirmOperationModal, {
      dismissible: false,
    });
    this.modalService.openModal();
  }

  public createContract(): void {
    // TODO: nothing yet
  }

  public signFile(): void {
    // TODO: nothing yet
  }

  public saveObservation(): void {
    const file: File = {
      id: this.fileData.id,
      observation: this.observations?.slice(0, this.observationMaxLength)
    };
    this.fileService.saveFile(file).subscribe();
  }

  public onConfirmOperation(): void {
    const file: File = {
      id: this.fileData.id,
      observation: this.observations?.slice(0, this.observationMaxLength)/**,
       status: */
    };
    this.fileService.saveFile(file).subscribe();
  }

  public showAction(action: FileAction): boolean {
    let show: boolean;
    const fileStatus: FileStatusCode = this.fileData?.status?.code;
    switch (action) {
      case FileAction.CONFIRM_OPERATION:
        show = fileStatus === FileStatusCode.GREEN_BOOKED;
        break;
      case FileAction.CREATE_ROUTES:
        show = fileStatus === FileStatusCode.NEW_REQUEST || fileStatus === FileStatusCode.SALES;
        break;
      case FileAction.CREATE_CONTRACT:
        show = this.routes?.filter((fileRoute: FileRoute) => fileRoute.status === RouteStatus.WON).length > 0;
        break;
      case FileAction.MODIFY_FILE:
        show = fileStatus !== FileStatusCode.CNX;
        break;
      case FileAction.SIGN_FILE:
        show = fileStatus === FileStatusCode.BLUE_BOOKED;
        break;
      default:
        show = false;
        break;
    }
    return show;
  }

  public isBookedGreen(): boolean{
    const statusId = this.fileForm?.get('statusId').value;
    return this.statusOptions.find((status: FileStatus) => status.id === statusId)?.code === 'GREEN_BOOKED';
  }

  public isBookedBlue(): boolean{
    const statusId = this.fileForm?.get('statusId').value;
    return this.statusOptions.find((status: FileStatus) => status.id === statusId)?.code === 'BLUE_BOOKED';
  }

  private validatorRequiredEditMode(formControl: FormControl): ValidationErrors {
    let error: ValidationErrors = null;
    if ((!formControl || !formControl.value) && this.isFileDetail) {
      error = {
        required: true
      };
    }
    return error;
  }
}
