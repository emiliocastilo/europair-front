import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { OperatorDetailComponent } from './components/operator-detail/operator-detail.component';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';

@NgModule({
  declarations: [OperatorsComponent, OperatorDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    OperatorsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class OperatorsModule {}
