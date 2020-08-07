import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypeDetailComponent } from './fleet-type-detail.component';

describe('FleetTypeDetailComponent', () => {
  let component: FleetTypeDetailComponent;
  let fixture: ComponentFixture<FleetTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
