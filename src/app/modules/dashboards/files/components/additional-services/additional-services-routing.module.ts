import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalServicesComponent } from './additional-services.component';

const routes: Routes = [
  { path: '', component: AdditionalServicesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalServicesRoutingModule {}
