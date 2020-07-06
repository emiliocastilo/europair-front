import { Component, OnInit } from '@angular/core';

import M from 'materialize-css';

@Component({
  selector: 'dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var elems = document.querySelectorAll('.menu');
    var instances = M.Pushpin.init(elems, {
      top: 0,
      offset: 0
    });
  }

}
