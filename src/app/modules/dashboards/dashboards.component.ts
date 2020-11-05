import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuModel } from 'src/app/core/models/menus/left-sidebar.model';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  readonly icons = [
    'europair_add',
    'europair_add_more',
    'europair_add_trace',
    'europair_document',
    'europair_edit',
    'europair_line_break',
    'europair_plane',
    'europair_trace',
    'europair_trash',
    'europair_feather_mail',
  ];
  public menuCollapsed: boolean;
  public menu: MenuModel;
  constructor(private readonly menuService: MenuService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    this.icons.forEach((i) => {
      iconRegistry.addSvgIcon(
        i,
        sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${i}.svg`)
      );
    });
  }

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
