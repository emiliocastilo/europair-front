import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';

@NgModule({
  declarations: [OperatorsComponent],
  imports: [CommonModule, OperatorsRoutingModule],
})
export class OperatorsModule {}
