import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
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

  public contractConditionsDataSource: MatTableDataSource<ContractCondition>;
  public conditionsColumnsToDisplay: Array<string> = ['selection', 'code', 'title', 'description', 'actions']

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contractConditionsService: ContractConditionsService
  ) { }

  ngOnInit(): void {
    this.obtainParams();
    this.getGeneralContractConditions();
  }

  private obtainParams(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.getContractConditions();
    });
  }

  private getGeneralContractConditions() {
    this.contractConditionsService.getGeneralContractConditions(this.conditionsFilter)
      .subscribe((page: Page<ContractCondition>) => {
        // this.contractConditionsDataSource = new MatTableDataSource(page.content);
        console.log(page);
      });
  }

  private getContractConditions(searchFilter?: SearchFilter) {
    this.contractConditionsService.getContractConditions(this.contractId, searchFilter)
      .subscribe((page: Page<ContractCondition>) => {
        this.contractConditionsDataSource = new MatTableDataSource(page.content);
      });
  }

  public deleteCondition(condition: ContractCondition): void {
    this.contractConditionsService.removeContractConditions(condition).subscribe(() => this.filterContractConditionsTable());
  }

  private filterContractConditionsTable() {
    this.getContractConditions(this.conditionsFilter);
  }


  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
