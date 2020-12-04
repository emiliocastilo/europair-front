import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationFeesComponent } from './components/cancellation-fees/cancellation-fees.component';
import { ContractConditionComponent } from './components/conditions/conditions.component';
import { ContractDetailComponent } from './contract-detail.component';

const routes: Routes = [
  { path: '', component: ContractDetailComponent },
  { path: 'conditions', component: ContractConditionComponent },
  { path: 'cancellation-fees', component: CancellationFeesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule { }
