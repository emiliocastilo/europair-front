import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirportDetailComponent } from './airport-detail.component';

const routes: Routes = [{ path: '', component: AirportDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportDetailRoutingModule { }
