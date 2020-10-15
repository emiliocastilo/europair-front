import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsComponent } from './contacts.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [ContactsComponent, ContactDetailComponent],
  imports: [CommonModule, ContactsRoutingModule,
    MaterialModule, CoreModule, ReactiveFormsModule],
})
export class ContactsModule { }
