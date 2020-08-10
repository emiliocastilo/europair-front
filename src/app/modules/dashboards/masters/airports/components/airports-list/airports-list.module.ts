import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportsListRoutingModule } from './airports-list-routing.module';
import { AirportsListComponent } from './airports-list.component';
import { CoreModule } from 'src/app/core/core.module';
import { TopBarComponent } from '../top-bar/top-bar.component';


@NgModule({
  declarations: [AirportsListComponent, TopBarComponent],
  imports: [
    CommonModule, AirportsListRoutingModule, CoreModule
  ]
})
export class AirportsListModule { }
