import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SearchAircraftRoutingModule } from './search-aircraft-routing.module';
import { SearchAircraftComponent } from './search-aircraft.component';

@NgModule({
  declarations: [SearchAircraftComponent],
  imports: [CommonModule, CoreModule, FormsModule, ReactiveFormsModule, MaterialModule, SearchAircraftRoutingModule]
})
export class SearchAircraftModule {}
