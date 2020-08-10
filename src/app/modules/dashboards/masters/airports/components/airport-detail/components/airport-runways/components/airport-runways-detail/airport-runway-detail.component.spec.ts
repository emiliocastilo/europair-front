import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportRunwayDetailComponent } from './airport-runway-detail.component';

describe('AirportRunwaysDetailComponent', () => {
  let component: AirportRunwayDetailComponent;
  let fixture: ComponentFixture<AirportRunwayDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AirportRunwayDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportRunwayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
