import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'core-sort-menu',
  templateUrl: './sort-menu.component.html',
  styleUrls: ['./sort-menu.component.scss'],
})
export class SortMenuComponent implements OnInit {
  @Input()
  public idModal: string = 'sort-menu-modal';
  constructor() {}

  ngOnInit(): void {}
}
