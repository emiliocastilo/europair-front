import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetSubcategoryDetailComponent } from './fleet-subcategory-detail.component';

describe('FleetSubcategoryDetailComponent', () => {
  let component: FleetSubcategoryDetailComponent;
  let fixture: ComponentFixture<FleetSubcategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetSubcategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetSubcategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
