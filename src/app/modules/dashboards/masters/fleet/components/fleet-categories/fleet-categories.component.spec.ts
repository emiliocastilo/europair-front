import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCategoriesComponent } from './fleet-categories.component';

describe('FleetCategoriesComponent', () => {
  let component: FleetCategoriesComponent;
  let fixture: ComponentFixture<FleetCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
