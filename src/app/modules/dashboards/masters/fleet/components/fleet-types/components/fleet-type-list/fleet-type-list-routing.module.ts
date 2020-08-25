import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetTypeListComponent } from './fleet-type-list.component';

const routes: Routes = [{ path: '', component: FleetTypeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleetTypeListRoutingModule {}
