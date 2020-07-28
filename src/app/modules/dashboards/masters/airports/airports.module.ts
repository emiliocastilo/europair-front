import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportsComponent } from './airports.component';
import { AirportsRoutingModule } from './airports-routing.module';


@NgModule({
  declarations: [AirportsComponent],
  imports: [CommonModule, AirportsRoutingModule]
})
export class AirportsModule { }
