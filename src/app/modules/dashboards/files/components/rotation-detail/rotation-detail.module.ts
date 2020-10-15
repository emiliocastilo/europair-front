import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RotationDetailRoutingModule } from './rotation-detail-routing.module';
import { RotationDetailComponent } from './rotation-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [RotationDetailComponent],
  imports: [
    CommonModule,
    RotationDetailRoutingModule,
    CoreModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class RotationDetailModule { }
