import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypesComponent } from './fleet-types.component';

describe('FleetTypesComponent', () => {
  let component: FleetTypesComponent;
  let fixture: ComponentFixture<FleetTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
