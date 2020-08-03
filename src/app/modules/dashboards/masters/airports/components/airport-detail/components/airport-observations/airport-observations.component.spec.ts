import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportObservationsComponent } from './airport-observations.component';

describe('AirportObservationsComponent', () => {
  let component: AirportObservationsComponent;
  let fixture: ComponentFixture<AirportObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
