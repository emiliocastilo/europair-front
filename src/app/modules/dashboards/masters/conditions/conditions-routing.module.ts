import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionDetailComponent } from './components/condition-detail/condition-detail.component';
import { ConditionsComponent } from './conditions.component';

const routes: Routes = [
  { path: '', component: ConditionsComponent },
  { path: ':id', component: ConditionDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConditionsRoutingModule { }
