import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypesTopBarComponent } from './fleet-types-top-bar.component';

describe('FleetTypesTopBarComponent', () => {
  let component: FleetTypesTopBarComponent;
  let fixture: ComponentFixture<FleetTypesTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypesTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypesTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
