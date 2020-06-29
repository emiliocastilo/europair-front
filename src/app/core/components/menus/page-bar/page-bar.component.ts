import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'core-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.scss'],
})
export class PageBarComponent implements OnInit {
  @Input()
  public pageTitle: string;
  @Input()
  public userData: any;

  constructor() {}

  ngOnInit(): void {}
}
