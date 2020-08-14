import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportCertifiedOperatorCreatorComponent } from './airport-certified-operator-creator.component';

describe('AirportCertifiedOperatorCreatorComponent', () => {
  let component: AirportCertifiedOperatorCreatorComponent;
  let fixture: ComponentFixture<AirportCertifiedOperatorCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportCertifiedOperatorCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportCertifiedOperatorCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
