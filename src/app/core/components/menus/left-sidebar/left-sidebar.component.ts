import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MenuModel } from 'src/app/core/models/menus/left-sidebar.model';

@Component({
  selector: 'core-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {
  @Input() public menu: MenuModel;
  @Output() collapseClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  public collapseMenu: boolean;


  ngOnInit(): void {
    this.collapseMenu = false;
  }

  public expandReduceMenu(): void {
    if (this.collapseMenu) {
      this.collapseMenu = false;
      this.collapseClick.emit(false);
    } else {
      this.collapseMenu = true;
      this.collapseClick.emit(true);
    }
  }

  public expandMenu(): void {
    if (this.collapseMenu) {
      this.collapseMenu = false;
      this.collapseClick.emit(false);
    }
  }
}
