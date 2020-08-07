import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportRunwaysComponent } from './airport-runways.component';

describe('AirportRunwaysComponent', () => {
  let component: AirportRunwaysComponent;
  let fixture: ComponentFixture<AirportRunwaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportRunwaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportRunwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
