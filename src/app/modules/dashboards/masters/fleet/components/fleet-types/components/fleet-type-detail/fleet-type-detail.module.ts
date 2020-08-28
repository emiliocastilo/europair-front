import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetTypeDetailRoutingModule } from './fleet-type-detail-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FleetTypeDetailComponent } from './fleet-type-detail.component';
import { SpeedAverageDetailComponent } from './components/speed-average-detail/speed-average-detail.component';
import { ObservationDetailComponent } from './components/observation-detail/observation-detail.component';

@NgModule({
  declarations: [FleetTypeDetailComponent, SpeedAverageDetailComponent, ObservationDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FleetTypeDetailRoutingModule,
  ],
})
export class FleetTypeDetailModule {}
