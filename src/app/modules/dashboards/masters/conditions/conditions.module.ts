import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConditionsComponent } from './conditions.component';
import { ConditionDetailComponent } from './components/condition-detail/condition-detail.component';
import { ConditionsRoutingModule } from './conditions-routing.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [ConditionsComponent, ConditionDetailComponent],
  imports: [
    CommonModule,
    ConditionsRoutingModule,
    MaterialModule,
    CoreModule,
    ReactiveFormsModule
    ]
})
export class ConditionsModule { }
