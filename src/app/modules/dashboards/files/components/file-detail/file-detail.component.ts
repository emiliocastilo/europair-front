import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  FileRoute,
  DAYS_LIST,
  FrequencyDay,
  RouteStatus,
  StandardWeekDays
} from '../../models/FileRoute.model';
import { FilesService } from '../../services/files.service';
import { Page } from 'src/app/core/models/table/pagination/page';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FileRoutesService } from '../../services/file-routes.service';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Client, ConfirmOperation, File, FileStatus, FileStatusCode } from '../../models/File.model';
import { FileStatusService } from '../../services/file-status.service';
import { ClientsService } from '../../services/clients.service';
import { ContributionService } from '../../services/contribution.service';
import { Contribution, ContributionStates } from '../search-aircraft/models/contribution.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { environment } from 'src/environments/environment';
import { ConfirmOperationService } from '../../services/confirm-operation.service';
import { Contact, OperationType } from '../../../masters/contacts/models/contact';
import { ContactsService } from '../../../masters/contacts/services/contact.service';
import { IntegrationOfficeService } from '../../services/integration-office.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { InfoDialogComponent } from 'src/app/core/components/dialogs/info-dialog/info-dialog.component';

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
  SIGN_FILE = 'SIGN_FILE',
  SHOW_ADDITIONAL_SERVICE = 'SHOW_ADDITIONAL_SERVICE',
  GENERATE_PLANING = 'GENERATE_PLANING'
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
  @ViewChild('routesTable') routesTable: MatTable<any>;
  @ViewChild('contributionsTable') contributionsTable: MatTable<any>;
  public readonly fieldMaxLength: number = 1500;
  public readonly observationMaxLength: number = 1300;

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
    'dayNumber',
    'status',
    'route-actions',
  ];
  public columnsAdditionalServicesToDisplay = [
    'code',
    'description',
    'quantity',
    'provider',
    'purchasePrice',
    'salePrice',
    'tax',
    'commision',
    'comment',
    'seller',
    'status',
  ];
  public columnsContributionsToDisplay = [
    'label',
    'requestTime',
    'operator',
    'aircraftType',
    'totalPassengers',
    'purchasePrice',
    'purchaseCommissionPercent',
    'salesPrice',
    'salesCommissionPercent',
    'status',
    'contribution-actions',
  ];
  public dataSource = new MatTableDataSource();
  public dataSourceRouteContributions = new MatTableDataSource();
  public dataSourceAdditionalService = new MatTableDataSource();
  public expandedRoutes: FileRoute[] = [];
  public expandedContributions: FileRoute[] = [];
  public expandedQuote: boolean;
  public resultsLength = 0;
  public pageSize = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;
  public observations: string;
  public hasRoutes: boolean;

  public fileForm: FormGroup = this.fb.group({
    code: [{ value: '', disabled: true }],
    description: [''],
    status: [''],
    client: ['', Validators.required],
    clientId: ['', Validators.required],
    contact: ['', Validators.required],
    contactId: ['', Validators.required],
    statusId: ['', this.validatorRequiredEditMode.bind(this)],
    operationType: ['', this.validatorRequiredEditMode.bind(this)]
  });

  public operationForm: FormGroup = this.fb.group({
    flightMotive: ['', Validators.maxLength(this.fieldMaxLength)],
    connections: ['', Validators.maxLength(this.fieldMaxLength)],
    limitations: ['', Validators.maxLength(this.fieldMaxLength)],
    fixedVariableFuel: ['', Validators.maxLength(this.fieldMaxLength)],
    luggage: ['', Validators.maxLength(this.fieldMaxLength)],
    specialLuggage: ['', Validators.maxLength(this.fieldMaxLength)],
    onBoardService: ['', Validators.maxLength(this.fieldMaxLength)],
    specialRequests: ['', Validators.maxLength(this.fieldMaxLength)],
    otherCharges: ['', Validators.maxLength(this.fieldMaxLength)],
    operationalInfo: ['', Validators.maxLength(this.fieldMaxLength)],
    observation: ['', Validators.maxLength(this.observationMaxLength)]
  });

  public statusOptions: FileStatus[] = [];
  private fileStatusList: FileStatus[];
  public operationsType: OperationType[] = [];
  public clientOptions$: Observable<Client[]>;
  public contactOptions$: Observable<Client[]>;

  public matcher = new FileErrorStateMatcher();

  private isFileDetail: boolean;
  private fileContributionsMap: Map<number, Contribution[]> = new Map();

  constructor(
    private fb: FormBuilder,
    private fileService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fileRoutesService: FileRoutesService,
    private fileStatusService: FileStatusService,
    private clientService: ClientsService,
    private contactService: ContactsService,
    private confirmOperationService: ConfirmOperationService,
    private contributionService: ContributionService,
    private readonly matDialog: MatDialog,
    private readonly integrationOfficeService: IntegrationOfficeService,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.loadClients();
    this.loadContacts();
    this.loadOperationType();
    this.obtainParams();
    this.routeData$ = this.route.data.pipe(tap(this.initFileData));
  }

  public isSmallScreen(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 993px)');
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

  // TODO: Improve client clientId relation
  private loadContacts(): void {
    this.fileForm
      .get('contact')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        if (typeof term === 'string') {
          this.contactOptions$ = term ? this.getFilteredContacts(term) : of([]);
        } else {
          this.fileForm.get('contactId').setValue(term.id);
        }
      });
  }

  private obtainParams(): void {
    this.route.queryParams.subscribe((params: Params) => this.expandedQuote = params.expandedQuote === "true");
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

  private getFilteredContacts(term: string): Observable<Contact[]> {
    const filter = {};
    return this.contactService.getContacts(filter).pipe(
      map((page: Page<Contact>) => page.content),
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
      status: file.status?.id,
    });

    this.loadStatus();
    this.loadFileRoutes(file);
    this.obtainOperation(file);
  }

  private loadStatus(): void {
    this.fileStatusService.getStatus()
      .subscribe((page: Page<FileStatus>) => {
        this.fileStatusList = page.content;
        this.loadStatusFile();
      });
  }

  private loadStatusFile(): void {
    this.fileStatusService.getAvailableStatus(this.fileData)
      .subscribe((fileStatus: Array<FileStatusCode>) => {
        const status: FileStatus[] = this.fileStatusList.filter((statusList: FileStatus) => fileStatus.includes(statusList.code));
        status.unshift(this.fileData.status);
        this.statusOptions = status;
      });
  }

  private loadOperationType(): void {
    this.operationsType = [
      OperationType.COMMERCIAL,
      OperationType.EXECUTIVE,
      OperationType.FREIGHT,
      OperationType.GROUP,
      OperationType.ACMI
    ];
  }

  private loadFileRoutes(file: File) {
    this.fileRoutesService
      .getFileRoutes(file.id, { size: '100' })
      .subscribe((data: Page<FileRoute>) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSourceRouteContributions = new MatTableDataSource(data.content.filter(route => this.hasRouteContributions(route)));
        this.routes = data.content;
        this.dataSource.sort = this.sort;
        this.resultsLength = data.totalElements;
        this.pageSize = data.size;
        this.hasRoutes = data.totalElements > 0;
      });
  }

  private obtainOperation(file: File): void {
    this.confirmOperationService.getConfirmOperations(file.id)
      .subscribe((operation: Page<ConfirmOperation>) => {
        if (operation.content.length > 0) {
          this.operationForm.patchValue(operation.content[0])
        }
      });
  }

  public returnToFileList() {
    // Remove file-detail related queryparams before navigate to file list
    this.router.navigate(['files'], {
        queryParams: {...this.route.snapshot.queryParams, expandedQuote: null}, 
        queryParamsHandling: 'merge' 
    });
  }

  public onSaveFile(update: boolean) {
    if (this.fileForm.valid) {
      this.fileData = {
        ...this.fileData,
        ...this.fileForm.value,
      };

      const file: File = {
        id: this.fileData?.id,
        clientId: this.fileForm.get('clientId').value,
        description: this.fileForm.get('description').value,
        statusId: this.fileForm.get('statusId').value,
        contactId: this.fileForm.get('contactId').value,
        providerId: 1,
        salePersonId: 1,
        saleAgentId: 1,
        operationType: this.fileForm.get('operationType').value || 'COMMERCIAL',
      };

      console.log('SAVING FILE', file);

      this.fileService.saveFile(file).subscribe((resp) => {
        if (!update) {
          this.router.navigate([`/files/${resp.id}`]);
        } else {
          this.fileService
            .getFileById(this.fileData.id)
            .subscribe((resp: File) => this.getFileData(resp));
        }
      });
    }
  }

  public updateFileState(statusId: number): void {
    const state: FileStatus = this.statusOptions.find((status: FileStatus) => status.id === statusId);
    this.fileService.updateState(this.fileData, state).subscribe(() => {
      this.fileService
        .getFileById(this.fileData.id)
        .subscribe((resp: File) => this.getFileData(resp));
    })
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

  public getRotationFormattedFrequency(startDate: string): string {
    return this.getFormattedFrequency([{ weekday: StandardWeekDays[new Date(startDate).getDay()]}]);
  }

  public getFormattedMonthDays(frequencyDays: FrequencyDay[]): string {
    return frequencyDays.filter(frequencyDay => frequencyDay.monthDay !== null).reduce(this.monthDayReducer, '');
  }

  private monthDayReducer = (monthDaysFormatted: string, frequencyDay: FrequencyDay): string => 
    monthDaysFormatted !== ''? `${monthDaysFormatted},${frequencyDay.monthDay}` : `${frequencyDay.monthDay}`;
  

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

  public navigateConfirmOperation(): void {
    this.router.navigate(['/files', this.fileData.id, 'confirm-operation']);
  }

  public navigateToCopyRoute(routeId: number) {
    this.router.navigate(['files', this.fileData.id,'routes' ,routeId]);
  }

  public navigateToSearchAircraft(id: number) {
    this.router.navigate(['/files/search-aircraft', this.fileData.id, id]);
  }

  public deleteRoute(routeId: number, confirmMsg: string): void {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'COMMON.CONFIRM_OPERATION',
          message: confirmMsg,
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fileRoutesService.deleteFileRouteById(this.fileData.id, routeId)
        .subscribe(() => this.loadFileRoutes(this.fileData));
      }
    });
  }

  public editRotation(route: FileRoute, rotation: FileRoute) {
    this.router.navigate(['files', this.fileData.id, 'routes', route.id, 'rotations', rotation.id]);
  }

  public hasControlAnyError(controlName: string): boolean {
    return this.hasControlAnyErrorSpecificForm(this.fileForm, controlName);
  }

  public hasControlAnyErrorSpecificForm(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    return this.hasControlSpecificErrorSpecificForm(this.fileForm, controlName, errorName);
  }

  public hasControlSpecificErrorSpecificForm(formGroup: FormGroup, controlName: string, errorName: string): boolean {
    const control = formGroup.get(controlName);
    return control && control.hasError(errorName);
  }
  public expandRow(element: FileRoute) {
    const index: number = this.expandedRoutes.indexOf(element);
    index !== -1
      ? this.expandedRoutes.splice(index, 1)
      : this.expandedRoutes.push(element);
    setTimeout(() => {
      this.routesTable.updateStickyColumnStyles();
    }, 1000);
  }

  public createContract(): void {
    // TODO: nothing yet
  }

  public signFile(): void {
    // TODO: nothing yet
  }

  public generatePlanning(): void {
    this.integrationOfficeService.generatePlanning(this.fileData).subscribe(() => this.matDialog.open(
      InfoDialogComponent,
      {
        data: {
          title: 'FILES.GENERATE_PLANING',
          message: 'FILES.GENERATE_PLANING_CONFIRM',
        },
      }
    ));
  }

  public onConfirmOperation(): void {
    const operation: ConfirmOperation = {
      ...this.operationForm.value
    };
    this.confirmOperationService.updateConfirmOperation(this.fileData.id, operation). subscribe();
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
        show =
          this.routes?.filter((fileRoute: FileRoute) => fileRoute.status === RouteStatus.WON).length > 0;
        break;
      case FileAction.MODIFY_FILE:
        show = fileStatus !== FileStatusCode.CNX;
        break;
      case FileAction.SIGN_FILE:
        show = false; //fileStatus === FileStatusCode.BLUE_BOOKED;
        break;
      case FileAction.SHOW_ADDITIONAL_SERVICE:
        show = fileStatus !== FileStatusCode.NEW_REQUEST && fileStatus !== FileStatusCode.SALES;
        break;
      case FileAction.GENERATE_PLANING:
        show = fileStatus === FileStatusCode.OPTIONED || fileStatus === FileStatusCode.BLUE_BOOKED || fileStatus === FileStatusCode.GREEN_BOOKED;
        break;
      default:
        show = false;
        break;
    }
    return show;
  }

  public isBookedGreen(): boolean {
    const statusId = this.fileForm?.get('statusId').value;
    return (
      this.statusOptions?.find((status: FileStatus) => status.id === statusId)
        ?.code === 'GREEN_BOOKED'
    );
  }

  public isBookedBlue(): boolean {
    const statusId = this.fileForm?.get('statusId').value;
    return (
      this.statusOptions?.find((status: FileStatus) => status.id === statusId)
        ?.code === 'BLUE_BOOKED'
    );
  }

  private validatorRequiredEditMode(
    formControl: FormControl
  ): ValidationErrors {
    let error: ValidationErrors = null;
    if ((!formControl || !formControl.value) && this.isFileDetail) {
      error = {
        required: true,
      };
    }
    return error;
  }

  public getContributionData(
    fileRoute: FileRoute
  ): MatTableDataSource<Contribution> {
    return new MatTableDataSource(this.fileContributionsMap.get(fileRoute.id));
  }

  public expandContributionsRow(element: FileRoute) {
    const index: number = this.expandedContributions.indexOf(element);
    index !== -1
      ? this.expandedContributions.splice(index, 1)
      : this.expandedContributions.push(element);
    setTimeout(() => {
      this.contributionsTable.updateStickyColumnStyles();
    }, 1000);
    // Avoid to search for contributions on row collapsing
    if (index === -1) {
      this.getFileRouteContributionData$(
        element.id
      ).subscribe((contributions: Contribution[]) =>
        this.fileContributionsMap.set(element.id, contributions)
      );
    }
  }

  public getFileRouteContributionData$(
    fileRouteId: number
  ): Observable<Contribution[]> {
    return this.contributionService.getContributionsWithTableData(
      this.fileData.id,
      fileRouteId,
      {
        size: '100',
        filter_removedAt: null,
      }
    );
  }

  public navigateToContributionDetail(
    fileRoute: FileRoute,
    contribution: Contribution
  ) {
    this.router.navigate(
      ['files', this.fileData.id, 'routes', fileRoute.id, 'contributions', contribution.id]
    );
  }

  public deleteContribution(fileRoute: FileRoute, contribution: Contribution) {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'COMMON.CONFIRM_OPERATION',
          message: 'FILES.CONTRIBUTIONS.DELETE_MSG',
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contributionService
          .deleteContribution(this.fileData.id, fileRoute.id, contribution)
          .pipe(
            tap(() => this.loadFileRoutes(this.fileData)),
            switchMap((_) => this.getFileRouteContributionData$(fileRoute.id))
          )
          .subscribe((contributions: Contribution[]) =>
            this.fileContributionsMap.set(fileRoute.id, contributions)
          );
      }
    });
  }

  public sendContribution(fileRoute: FileRoute, contribution: Contribution) {
    const confirmOperationRef = this.matDialog.open(
      ConfirmOperationDialogComponent,
      {
        data: {
          title: 'COMMON.CONFIRM_OPERATION',
          message: 'FILES.CONTRIBUTIONS.SEND_MSG',
        },
      }
    );
    confirmOperationRef.afterClosed().subscribe((result) => {
      if (result) {
        window.open(`${environment.powerAppUrl.sendContribution}?contributionId=${contribution.id}`);
        if (contribution.contributionState === ContributionStates.PENDING) {
          this.contributionService
          .updateContributionsState(contribution.fileId, contribution.routeId, contribution, ContributionStates.SENDED)
          .subscribe(() => this.expandContributionsRow(fileRoute));
        }
      }
    });
  }

  public isContributionSendable({ contributionState }: Contribution): boolean {
    return contributionState === ContributionStates.PENDING || contributionState === ContributionStates.SENDED;
  }

  public hasRouteContributions(route: FileRoute) {
    return route?.contributions?.length > 0;
  }

  public getTotalPassengers(contribution: Contribution) {
    return (
      contribution.seatingC + contribution.seatingF + contribution.seatingY
    );
  }
}
