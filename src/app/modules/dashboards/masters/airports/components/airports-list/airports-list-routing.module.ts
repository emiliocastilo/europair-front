import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirportsListComponent } from './airports-list.component';

const routes: Routes = [{ path: '', component: AirportsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportsListRoutingModule { }
