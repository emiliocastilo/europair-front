import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ContractRoutingModule } from './contract-detail-routing.module';
import { ContractDetailComponent } from './contract-detail.component';

@NgModule({
  declarations: [ContractDetailComponent],
  imports: [CommonModule, CoreModule, MaterialModule, ContractRoutingModule, ReactiveFormsModule],
})
export class ContractModule {}
