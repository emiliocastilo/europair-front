import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'core-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input()
  public idModal: string = 'default-modal';

  constructor() {}

  ngOnInit(): void {}
}
