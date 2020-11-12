import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributionLineDetailRoutingModule } from './contribution-line-detail-routing.module';
import { ContributionLineDetailComponent } from './contribution-line-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [ContributionLineDetailComponent],
  imports: [
    CommonModule,
    ContributionLineDetailRoutingModule,
    CoreModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class ContributionLineDetailModule {}
