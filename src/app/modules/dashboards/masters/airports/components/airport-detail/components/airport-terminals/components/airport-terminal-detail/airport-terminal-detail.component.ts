import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Terminal } from 'src/app/modules/dashboards/masters/airports/models/airport';

@Component({
  selector: 'app-airport-terminal-detail',
  templateUrl: './airport-terminal-detail.component.html',
  styleUrls: ['./airport-terminal-detail.component.scss'],
})
export class AirportTerminalDetailComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public terminalForm: FormGroup;

  @Output()
  public saveTerminal = new EventEmitter<Terminal>();

  constructor() {}

  ngOnInit(): void {}

  public onSaveTerminal() {
    this.saveTerminal.next(this.terminalForm.value);
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.terminalForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(
    controlName: string,
    errorName: string
  ): boolean {
    const control = this.terminalForm.get(controlName);
    return control && control.hasError(errorName);
  }
}
