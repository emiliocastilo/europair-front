import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CancellationFeesComponent } from './components/cancellation-fees/cancellation-fees.component';
import { ContractConditionComponent } from './components/conditions/conditions.component';
import { ContractRoutingModule } from './contract-detail-routing.module';
import { ContractDetailComponent } from './contract-detail.component';

@NgModule({
  declarations: [
    ContractDetailComponent,
    ContractConditionComponent,
    CancellationFeesComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    ContractRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,
  ],
})
export class ContractModule {}
