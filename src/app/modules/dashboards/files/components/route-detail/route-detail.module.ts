import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { RouteDetailRoutingModule } from './route-detail-routing.module';
import { RouteDetailComponent } from './route-detail.component';

@NgModule({
  declarations: [RouteDetailComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouteDetailRoutingModule,
    TranslateModule,
  ],
})
export class RouteDetailModule {}
