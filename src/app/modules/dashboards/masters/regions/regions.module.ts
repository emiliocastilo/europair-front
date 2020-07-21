import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsComponent } from './regions.component';
import { RegionDetailComponent } from './components/region-detail/region-detail.component';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegionsComponent, RegionDetailComponent],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    CoreModule,
    ReactiveFormsModule,
  ],
})
export class RegionsModule {}
