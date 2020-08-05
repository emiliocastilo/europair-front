import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportsComponent } from './airports.component';
import { AirportsRoutingModule } from './airports-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AirportsComponent],
  imports: [CommonModule, AirportsRoutingModule, CoreModule, ReactiveFormsModule]
})
export class AirportsModule { }
