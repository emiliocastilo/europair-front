import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';

@NgModule({
  declarations: [OperatorsComponent],
  imports: [
    CommonModule,
    CoreModule,
    OperatorsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class OperatorsModule {}
