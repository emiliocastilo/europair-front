import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AdditionalServicesRoutingModule } from './additional-services-routing.module';
import { AdditionalServicesComponent } from './additional-services.component';
@NgModule({
  declarations: [AdditionalServicesComponent],
  imports: [
    CommonModule,
    CoreModule,
    AdditionalServicesRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class AditionalServicesModule {}
