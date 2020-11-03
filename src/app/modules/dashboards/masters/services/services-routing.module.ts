import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { ServicesComponent } from './services.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  {
    path: 'new', component: ServiceDetailComponent,
    data: { title: 'SERVICES.NEW', isServiceDetail: false }
  },
  {
    path: ':id', component: ServiceDetailComponent,
    data: { title: 'SERVICES.DETAIL_PAGE_TITLE', isServiceDetail: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
