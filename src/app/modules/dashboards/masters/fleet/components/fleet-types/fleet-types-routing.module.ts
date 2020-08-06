import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleetTypesComponent } from './fleet-types.component';

const routes: Routes = [{ path: '', component: FleetTypesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetTypesRoutingModule { }
