import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedAverageDetailComponent } from './speed-average-detail.component';

describe('SpeedAverageDetailComponent', () => {
  let component: SpeedAverageDetailComponent;
  let fixture: ComponentFixture<SpeedAverageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedAverageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedAverageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
