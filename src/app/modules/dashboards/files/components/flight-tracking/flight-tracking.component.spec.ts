import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTrackingComponent } from './flight-tracking.component';

describe('FlightTrackingComponent', () => {
  let component: FlightTrackingComponent;
  let fixture: ComponentFixture<FlightTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
