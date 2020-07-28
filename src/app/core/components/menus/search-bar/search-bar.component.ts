import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output()
  public onBasicSearch: EventEmitter<string> = new EventEmitter();
  public iconConfig: InputTextIcon;

  constructor() {
    this.iconConfig = {
      icon: 'search',
      position: InputTextIconPositions.PREFIX,
    };
  }

  ngOnInit(): void {}

  public onBasicSearchInputChanged(searchTerm: string) {
    this.onBasicSearch.next(searchTerm);
  }
}
