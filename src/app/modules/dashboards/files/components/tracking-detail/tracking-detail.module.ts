import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TrackingDetailRoutingModule } from './tracking-detail-routing.module';
import { TrackingDetailComponent } from './tracking-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TrackingDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TrackingDetailRoutingModule,
  ],
  providers: [DatePipe],
})
export class TrackingDetailModule {}
