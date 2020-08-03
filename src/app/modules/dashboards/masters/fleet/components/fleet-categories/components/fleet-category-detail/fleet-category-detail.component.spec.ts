import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCategoryDetailComponent } from './fleet-category-detail.component';

describe('FleetCategoryDetailComponent', () => {
  let component: FleetCategoryDetailComponent;
  let fixture: ComponentFixture<FleetCategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
