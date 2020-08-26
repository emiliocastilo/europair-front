import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LeftSidebarService } from 'src/app/core/services/left-sidebar.service';
import { LeftSideBarModel } from 'src/app/core/models/menus/left-sidebar.model';

@Component({
  selector: 'core-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @Output() collapseClick:EventEmitter<boolean> = new EventEmitter<boolean>();
  public menu:LeftSideBarModel;
  public collapseMenu:boolean;

  constructor(private leftSideBarService:LeftSidebarService) { }

  ngOnInit(): void {
    this.collapseMenu = false;
    this.leftSideBarService.getMenu().subscribe(
      (data) => {
        this.menu = data
      } 
    );
  }

  public expandReduceMenu():void{
    if(this.collapseMenu){
      this.collapseMenu = false;
      this.collapseClick.emit(false);
    } else{
      this.collapseMenu = true;
      this.collapseClick.emit(true);
    }
  }

}
