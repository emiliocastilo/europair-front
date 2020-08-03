import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirportDetailRoutingModule } from './airport-detail-routing.module';
import { AirportDetailComponent } from './airport-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { AirportGeneralDataComponent } from './components/airport-general-data/airport-general-data.component';
import { AirportRunwaysComponent } from './components/airport-runways/airport-runways.component';
import { AirportTerminalsComponent } from './components/airport-terminals/airport-terminals.component';
import { AirportCertifiedOperatorsComponent } from './components/airport-certified-operators/airport-certified-operators.component';
import { AirportRegionsComponent } from './components/airport-regions/airport-regions.component';
import { AirportObservationsComponent } from './components/airport-observations/airport-observations.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AirportDetailComponent, AirportGeneralDataComponent, AirportRunwaysComponent, AirportTerminalsComponent, AirportCertifiedOperatorsComponent, AirportRegionsComponent, AirportObservationsComponent],
  imports: [CommonModule, AirportDetailRoutingModule, CoreModule, ReactiveFormsModule],
})
export class AirportDetailModule {}
