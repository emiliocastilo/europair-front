import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportRegionsComponent } from './airport-regions.component';

describe('AirportRegionsComponent', () => {
  let component: AirportRegionsComponent;
  let fixture: ComponentFixture<AirportRegionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportRegionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
