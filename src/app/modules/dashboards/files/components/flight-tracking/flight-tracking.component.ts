import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SearchFilter } from 'src/app/core/models/search/search-filter';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Flight } from '../../models/Flight.model';
import { FlightsService } from './services/flights.service';

@Component({
  selector: 'app-flight-tracking',
  templateUrl: './flight-tracking.component.html',
  styleUrls: ['./flight-tracking.component.scss'],
})
export class FlightTrackingComponent implements OnInit {
  
  public dataSource = new MatTableDataSource<Flight>();
  public displayedColumns = [
    'origin',
    'destination',
    'realDepartureTime',
    'realArrivalTime',
  ];
  public paginatorLength: number = 0;
  public paginatorSize: number = 0;
  private flightSearchFilter: SearchFilter = {};

  constructor(
    private readonly flightService: FlightsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFlightData();
  }

  private getFlightData(flightSearchFilter: SearchFilter = {}) {
    flightSearchFilter = {
      ...flightSearchFilter
    };
    this.flightService.getFlights(flightSearchFilter).subscribe(this.updateFlightsData);
  }

  private updateFlightsData = (flights: Page<Flight>) => {
    this.dataSource = new MatTableDataSource<Flight>(flights.content);
    this.paginatorLength = flights.totalElements;
    this.paginatorSize = flights.size;
  };

  public goToFlight(flight: Flight) {
    this.router.navigate(['files/flight-tracking', flight.id]);
  }

  public onSortFlights(sort: Sort) {
    this.flightSearchFilter['sort'] = `${sort.active.replace('-', '.')},${sort.direction}`;
    this.getFlightData(this.flightSearchFilter);
  }

  public onPage(pageEvent: PageEvent) {
    this.flightSearchFilter['page'] = pageEvent.pageIndex.toString();
    this.flightSearchFilter['size'] = pageEvent.pageSize.toString();
    this.getFlightData(this.flightSearchFilter);
  }
}
