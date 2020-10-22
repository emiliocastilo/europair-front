import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContributionDetailComponent } from './contribution-detail.component';

const routes: Routes = [{ path: '', component: ContributionDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionDetailRoutingModule { }
