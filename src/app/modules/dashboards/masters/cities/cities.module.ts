import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CitiesComponent } from './cities.component';
import { CityDetailComponent } from './components/city-detail/city-detail.component';
import { CitiesRoutingModule } from './cities-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CitiesComponent, CityDetailComponent],
  imports: [CommonModule, CitiesRoutingModule, CoreModule, ReactiveFormsModule, FormsModule]
})
export class CitiesModule { }
