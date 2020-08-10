import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  InputTextIcon,
  InputTextIconPositions,
} from 'src/app/core/models/basic/input-text/input-text-icon';

@Component({
  selector: 'core-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input()
  public inputSearchId = 'basic-search-input';
  @Output()
  public basicSearch: EventEmitter<string> = new EventEmitter();
  @Output()
  public openAdvancedSearch: EventEmitter<void> = new EventEmitter();
  @Output()
  public openSortMenu: EventEmitter<void> = new EventEmitter();
  public iconConfig: InputTextIcon;

  constructor() {
    this.iconConfig = {
      icon: 'search',
      position: InputTextIconPositions.PREFIX,
    };
  }

  ngOnInit(): void {}

  public onBasicSearchInputChanged(searchTerm: string) {
    this.basicSearch.next(searchTerm);
  }

  public onClickOpenAdvancedSearch() {
    this.openAdvancedSearch.next();
  }

  public onClickOpenSortMenu() {
    this.openSortMenu.next();
  }
}
