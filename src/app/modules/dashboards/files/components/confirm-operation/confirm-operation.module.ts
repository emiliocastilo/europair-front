import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ConfirmOperationRoutingModule } from './confirm-operation-routing.module';
import { ConfirmOperationComponent } from './confirm-operation.component';
@NgModule({
  declarations: [ConfirmOperationComponent],
  imports: [
    CommonModule,
    CoreModule,
    ConfirmOperationRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
})
export class ConfirmOperationModule {}
