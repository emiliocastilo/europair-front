import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  public menuCollapsed: boolean;
  constructor() {}

  ngOnInit(): void {
    this.menuCollapsed = false;
  }

  ngAfterViewInit(): void {
    var elems = document.querySelectorAll('.left-sidebar');
    var instances = M.Pushpin.init(elems, {
      top: 0,
      offset: 0,
    });
  }

  public onCollapseClick(event:any): void{
    if(event){
      this.menuCollapsed = true;
    } else{
      this.menuCollapsed = false;
    }
  }
}
