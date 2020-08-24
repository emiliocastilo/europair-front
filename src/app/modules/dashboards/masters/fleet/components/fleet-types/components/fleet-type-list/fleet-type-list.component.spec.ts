import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetTypeListComponent } from './fleet-type-list.component';

describe('FleetTypeListComponent', () => {
  let component: FleetTypeListComponent;
  let fixture: ComponentFixture<FleetTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
