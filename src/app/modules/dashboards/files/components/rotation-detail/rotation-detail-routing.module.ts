import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RotationDetailComponent } from './rotation-detail.component';

const routes: Routes = [{ path: '', component: RotationDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RotationDetailRoutingModule { }
