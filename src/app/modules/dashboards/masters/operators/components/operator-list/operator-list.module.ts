import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { OperatorListRoutingModule } from './operator-list-routing.module';
import { OperatorListComponent } from './operator-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OperatorListComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    OperatorListRoutingModule,
  ],
})
export class OperatorListModule {}
