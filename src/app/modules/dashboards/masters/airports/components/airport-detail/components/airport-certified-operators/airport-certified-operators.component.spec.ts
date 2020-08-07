import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportCertifiedOperatorsComponent } from './airport-certified-operators.component';

describe('AirportCertifiedOperatorsComponent', () => {
  let component: AirportCertifiedOperatorsComponent;
  let fixture: ComponentFixture<AirportCertifiedOperatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportCertifiedOperatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportCertifiedOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
