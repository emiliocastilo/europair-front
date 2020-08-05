import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftRoutingModule } from './aircraft-routing.module';
import { AircraftComponent } from './aircraft.component';
import { AircraftDetailComponent } from './components/aircraft-detail/aircraft-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AircraftComponent, AircraftDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    AircraftRoutingModule,
  ],
})
export class AircraftModule {}
