import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirportsComponent } from './airports.component';

const routes: Routes =
  [{
    path: '',
    component: AirportsComponent,
    children:
      [{
        path: '',
        loadChildren: () => import('./components/airports-list/airports-list.module').then(m => m.AirportsListModule)
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportsRoutingModule { }
