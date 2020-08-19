import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftDetailRoutingModule } from './aircraft-detail-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AircraftDetailComponent } from './aircraft-detail.component';

@NgModule({
  declarations: [AircraftDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    AircraftDetailRoutingModule,
  ],
})
export class AircraftDetailModule {}
