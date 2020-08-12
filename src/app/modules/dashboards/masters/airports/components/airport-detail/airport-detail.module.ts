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
import { AirportRunwayDetailComponent } from './components/airport-runways/components/airport-runways-detail/airport-runway-detail.component';
import { AirportTerminalDetailComponent } from './components/airport-terminals/components/airport-terminal-detail/airport-terminal-detail.component';
import { AirportObservationDetailComponent } from './components/airport-observations/components/airport-observation-detail/airport-observation-detail.component';
import { AirportRegionEditorComponent } from './components/airport-regions/components/airport-region-editor/airport-region-editor.component';

@NgModule({
  declarations: [
    AirportDetailComponent,
    AirportGeneralDataComponent,
    AirportRunwaysComponent,
    AirportTerminalsComponent,
    AirportCertifiedOperatorsComponent,
    AirportRegionsComponent,
    AirportObservationsComponent,
    AirportRunwayDetailComponent,
    AirportTerminalDetailComponent,
    AirportObservationDetailComponent,
    AirportRegionEditorComponent,
  ],
  imports: [
    CommonModule,
    AirportDetailRoutingModule,
    CoreModule,
    ReactiveFormsModule,
  ],
})
export class AirportDetailModule {}
