import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-translated-snack-bar',
  templateUrl: './translated-snack-bar.component.html',
  styleUrls: ['./translated-snack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TranslatedSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
