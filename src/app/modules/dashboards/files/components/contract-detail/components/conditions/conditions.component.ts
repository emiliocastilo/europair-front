import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Page } from 'src/app/core/models/table/pagination/page';
import { ContractCondition } from '../../models/contract-condition.model';
import { ContractConditionsService } from '../../services/contract-condition.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ContractConditionComponent implements OnInit {
  public condition: ContractCondition;
  public fileId: number;
  public contractId: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contractConditionsService: ContractConditionsService
  ) { }

  ngOnInit(): void {
    this.getContractCondition();
  }

  private getContractCondition(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.contractConditionsService.getContractConditions({ 'filter_contract.id': params.contractId })
        .subscribe((page: Page<ContractCondition>) => {
          if (page.content.length === 1) {
            this.condition = page.content[0];
          }
        });
    });
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
