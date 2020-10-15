import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { ContactsComponent } from './contacts.component';

const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: ':id', component: ContactDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
