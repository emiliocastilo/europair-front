import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportsListRoutingModule } from './airports-list-routing.module';
import { AirportsListComponent } from './airports-list.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AirportsListComponent],
  imports: [
    CommonModule, AirportsListRoutingModule, CoreModule, ReactiveFormsModule
  ]
})
export class AirportsListModule { }
