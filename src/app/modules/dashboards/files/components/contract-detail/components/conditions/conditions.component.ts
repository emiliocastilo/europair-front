import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Condition } from 'src/app/modules/dashboards/masters/conditions/models/conditions';
import { ContractCondition } from '../../models/contract-condition.model';
import { ContractConditionCopy, ContractConditionsService } from '../../services/contract-condition.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ContractConditionComponent implements OnInit {
  public conditionsAsigned: Array<ContractCondition>;
  public fileId: number;
  public contractId: number;

  public contractConditionsDataSource: MatTableDataSource<ContractCondition>;
  public conditionsColumnsToDisplay: Array<string> = ['selection', 'code', 'title', 'description']

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contractConditionsService: ContractConditionsService
  ) { }

  ngOnInit(): void {
    this.obtainParams();
  }

  private obtainParams(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.getAllConditions();
      this.getContractConditions();
    });
  }

  private getAllConditions() {
    this.contractConditionsService.getContractConditions()
      .subscribe((page: Page<ContractCondition>) => {
        this.contractConditionsDataSource = new MatTableDataSource(page.content);
      });
  }

  private getContractConditions() {
    this.contractConditionsService.getContractConditions({ 'filter_contract.id': `${this.contractId}` })
      .subscribe((page: Page<ContractCondition>) => {
        this.conditionsAsigned = page.content;
      });
  }

  public selectCondition(selected, condition: Condition): void {
    const conditions: Array<number> = this.conditionsAsigned.map((condition: ContractCondition) => condition.id);
    if (selected) {
      conditions.push(condition.id);
    } else {
      conditions.slice(conditions.indexOf(condition.id), 1);
    }
    const contractCopy: ContractConditionCopy = {
      contractId: this.contractId,
      conditions
    }
    this.contractConditionsService.addConditionsToContract(contractCopy).subscribe(() => this.getContractConditions());
  }

  public conditionSelected(condition: ContractCondition): boolean {
    debugger;
    return this.conditionsAsigned.includes(condition);
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
