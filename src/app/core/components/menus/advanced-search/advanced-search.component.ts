import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'core-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  @Input()
  public idModal: string = 'advanced-search-modal';
  constructor() {}

  ngOnInit(): void {}
}
