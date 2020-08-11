import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportTerminalDetailComponent } from './airport-terminal-detail.component';

describe('AirportTerminalDetailComponent', () => {
  let component: AirportTerminalDetailComponent;
  let fixture: ComponentFixture<AirportTerminalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportTerminalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportTerminalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
