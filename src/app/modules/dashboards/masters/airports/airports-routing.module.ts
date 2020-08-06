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
      },
      { path: 'new',
        loadChildren: () => import('./components/airport-detail/airport-detail.module').then(m => m.AirportDetailModule),
        data: { title: 'Nuevo aeropuerto', isAirportDetail: false }
      },
      { path: ':airportId',
        loadChildren: () => import('./components/airport-detail/airport-detail.module').then(m => m.AirportDetailModule),
        data: { title: 'Detalle aeropuerto', isAirportDetail: true } 
      }]
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportsRoutingModule { }
