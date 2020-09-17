import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteDetailComponent } from './route-detail.component';

const routes: Routes = [{ path: '', component: RouteDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouteDetailRoutingModule {}
