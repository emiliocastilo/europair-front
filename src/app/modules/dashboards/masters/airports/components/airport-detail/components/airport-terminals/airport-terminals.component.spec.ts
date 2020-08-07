import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportTerminalsComponent } from './airport-terminals.component';

describe('AirportTerminalsComponent', () => {
  let component: AirportTerminalsComponent;
  let fixture: ComponentFixture<AirportTerminalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportTerminalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportTerminalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
