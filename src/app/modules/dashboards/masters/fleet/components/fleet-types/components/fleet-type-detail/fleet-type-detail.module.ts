import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypeDetailRoutingModule } from './fleet-type-detail-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FleetTypeDetailComponent } from './fleet-type-detail.component';

@NgModule({
  declarations: [FleetTypeDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FleetTypeDetailRoutingModule,
  ],
})
export class FleetTypeDetailModule {}
