import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingDetailComponent } from './tracking-detail.component';

const routes: Routes = [{ path: '', component: TrackingDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingDetailRoutingModule {}
