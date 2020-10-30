import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributionDetailRoutingModule } from './contribution-detail-routing.module';
import { ContributionDetailComponent } from './contribution-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContributionDetailComponent],
  imports: [
    CommonModule,
    ContributionDetailRoutingModule,
    CoreModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class ContributionDetailModule {}
