import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from './countries.component';
import { CoreModule } from 'src/app/core/core.module';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CountriesRoutingModule } from './countries-routing.module';



@NgModule({
  declarations: [CountriesComponent, CountryDetailComponent],
  imports: [CommonModule, CountriesRoutingModule, CoreModule, ReactiveFormsModule]
})
export class CountriesModule { }
