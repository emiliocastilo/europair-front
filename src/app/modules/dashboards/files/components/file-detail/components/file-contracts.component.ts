import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { Observable } from 'rxjs';
import { Contract, ContractStates } from '../../../models/Contract.model';

@Component({
  selector: 'app-file-contracts',
  templateUrl: './file-contracts.component.html',
  styleUrls: ['./file-contracts.component.scss']
})
export class FileContractsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('contractsTable') contractsTable: MatTable<any>;
  @Output() contractDetail: EventEmitter<number> = new EventEmitter();
  @Output() copyContract: EventEmitter<Contract> = new EventEmitter();
  @Input() set contracts(contracts: Array<Contract>) {
    this.dataSource =  new MatTableDataSource(contracts);
  }

  public routeData$: Observable<Data>;
  public pageTitle: string;

  public columnsToDisplay = [
    'code',
    'contractDate',
    'signatureDate',
    'contractType',
    'contractState',
    'configuration',
    'conditions',
    'cancelationFees',
    'contractActions'
  ];
  public dataSource = new MatTableDataSource();
  public resultsLength = 0;
  public pageSize = 0;


  constructor() {}

  ngOnInit(): void {
  }

  public onSelectContract(contract: Contract): void {
    this.contractDetail.emit(contract.id);
  }

  public isContractSigned(contract: Contract): boolean {
    return contract?.contractState === ContractStates.SIGNED;
  }

  public onCopyContract(contract: Contract) {
    this.copyContract.emit(contract);
  }
}
