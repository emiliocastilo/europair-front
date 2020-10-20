import { Component, OnInit } from '@angular/core';
import { MenuModel } from 'src/app/core/models/menus/left-sidebar.model';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  public menuCollapsed: boolean;
  public menu: MenuModel;
  constructor(private readonly menuService: MenuService) { }

  ngOnInit(): void {
    this.menuCollapsed = false;
    this.menuService.getMenu().subscribe((data: MenuModel) => {
      this.menu = data;
    });
  }

  ngAfterViewInit(): void {
    var elems = document.querySelectorAll('.left-sidebar');
    var instances = M.Pushpin.init(elems, {
      top: 0,
      offset: 0,
    });
  }

  public onCollapseClick(event: any): void {
    if (event) {
      this.menuCollapsed = true;
    } else {
      this.menuCollapsed = false;
    }
  }
}
