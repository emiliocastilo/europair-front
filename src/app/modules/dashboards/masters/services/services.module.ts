import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';

@NgModule({
  declarations: [ServicesComponent, ServiceDetailComponent],
  imports: [CommonModule, ServicesRoutingModule,
    MaterialModule, CoreModule, ReactiveFormsModule],
})
export class ServicesModule { }
