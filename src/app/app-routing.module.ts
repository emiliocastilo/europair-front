import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardsModule } from './modules/dashboards/dashboards.module';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => DashboardsModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
