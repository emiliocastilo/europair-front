import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ConfirmOperationDialogComponent } from 'src/app/core/components/dialogs/confirm-operation-dialog/confirm-operation-dialog.component';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ContractCondition } from '../../models/contract-condition.model';
import { ContractConditionsService } from '../../services/contract-condition.service';
@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ContractConditionComponent implements OnInit {
  public fileId: number;
  public contractId: number;
  private conditionsFilter: SearchFilter = {};
  public isContractConditionFormVisible: boolean = false;
  public contractConditionForm = this.fb.group({
    id: [null],
    code: ['', Validators.required],
    title: ['', Validators.required],
    conditionOrder: ['', Validators.required],
    description: ['']
  });

  public quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link']                         // link and image, video
    ]
  };

  public generalConditions$: Observable<ContractCondition[]>;
  public generalConditionsInput$ = new Subject<string>();
  public generalConditionsLoading = false;
  public generalConditionsControl: FormControl = this.fb.control('');

  public contractConditionsDataSource: MatTableDataSource<ContractCondition>;
  public selection = new SelectionModel<ContractCondition>(false, []);
  public conditionsColumnsToDisplay: Array<string> = ['selection', 'code', 'title', 'description', 'actions']

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contractConditionsService: ContractConditionsService,
    private readonly fb: FormBuilder,
    private readonly matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtainParams();
    this.loadGeneralContractConditions();
    this.initializeSubscribes();
  }

  private obtainParams(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.getContractConditions();
    });
  }

  private getContractConditions(searchFilter?: SearchFilter) {
    this.contractConditionsService.getContractConditions(this.contractId, searchFilter)
      .subscribe((page: Page<ContractCondition>) => {
        this.contractConditionsDataSource = new MatTableDataSource(page.content);
      });
  }

  private loadGeneralContractConditions(): void {
    this.generalConditions$ = concat(
      of([]), // default items
      this.generalConditionsInput$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.generalConditionsLoading = true)),
        switchMap((term: string) =>
          this.contractConditionsService.getGeneralContractConditions({ filter_title: term }).pipe(
            map((page: Page<ContractCondition>) => page.content),
            catchError(() => of([])), // empty list on error
            tap(() => (this.generalConditionsLoading = false))
          )
        )
      )
    );
  }

  private initializeSubscribes() {
    this.generalConditionsControlValueChangesSubscribe();
  }

  private generalConditionsControlValueChangesSubscribe(): void {
    this.generalConditionsControl.valueChanges
      .subscribe(this.onGeneralConditionsControlChanges);
  }

  private onGeneralConditionsControlChanges = (generalConditionSelected: ContractCondition): void => {
    this.generalConditionsControl.patchValue([], { emitEvent: false });
    this.contractConditionsService.saveGeneralConditionToContract(this.contractId, generalConditionSelected)
      .subscribe((contractCondition) => this.filterContractConditionsTable());
  };

  public deleteCondition(condition: ContractCondition): void {
    const confirmOperationRef = this.matDialog.open(ConfirmOperationDialogComponent, {
      data: {
        title: 'FILES_CONTRACT.CONDITIONS.DELETE_TITLE',
        message: 'FILES_CONTRACT.CONDITIONS.DELETE_MSG',
        translationParams: condition
      }
    });
    confirmOperationRef.afterClosed().subscribe(result => {
      if(result) {
        this.contractConditionsService.removeContractConditions(condition).subscribe(() => this.filterContractConditionsTable());
      }
    });
  }

  public saveCondition(): void {
    this.contractConditionForm.markAllAsTouched();
    if (this.contractConditionForm.valid) {
      this.contractConditionsService.saveContractCondition(this.contractConditionForm.value)
        .subscribe(() => this.filterContractConditionsTable());
    }
  }

  public onContractConditionSelected(contractCondition: ContractCondition) {
    this.selection.toggle(contractCondition);
    if(this.selection.isEmpty()) {
      this.hideCancellationFeeForm();
    }else {
      this.updateContractConditionForm(contractCondition);
      this.showCancellationFeeForm();
    }
  }

  private updateContractConditionForm(contractCondition: ContractCondition) {
    this.contractConditionForm.patchValue(contractCondition);
  }

  private hideCancellationFeeForm(): void {
    this.isContractConditionFormVisible = false;
  }

  private showCancellationFeeForm(): void {
    this.isContractConditionFormVisible = true;
  }

  private filterContractConditionsTable() {
    this.hideCancellationFeeForm();
    this.getContractConditions(this.conditionsFilter);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.contractConditionForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.contractConditionForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
