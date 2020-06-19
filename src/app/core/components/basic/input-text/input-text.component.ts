import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'core-basic-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {
  @Input() id:string;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

}
