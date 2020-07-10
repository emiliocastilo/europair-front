import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-mobile-bar',
  templateUrl: './mobile-bar.component.html',
  styleUrls: ['./mobile-bar.component.scss']
})
export class MobileBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {  }

  ngAfterViewInit(): void {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  }

}
