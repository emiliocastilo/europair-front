import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportGeneralDataComponent } from './airport-general-data.component';

describe('AirportGeneralDataComponent', () => {
  let component: AirportGeneralDataComponent;
  let fixture: ComponentFixture<AirportGeneralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportGeneralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
