import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportObservationDetailComponent } from './airport-observation-detail.component';

describe('AirportObservationDetailComponent', () => {
  let component: AirportObservationDetailComponent;
  let fixture: ComponentFixture<AirportObservationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportObservationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportObservationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
