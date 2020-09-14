import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchAircraftComponent } from './search-aircraft.component';

const routes: Routes = [{ path: '', component: SearchAircraftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchAircraftRoutingModule {}
