import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    var elems = document.querySelectorAll('.left-sidebar');
    var instances = M.Pushpin.init(elems, {
      top: 0,
      offset: 0,
    });
  }
}
