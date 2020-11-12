import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionLineDetailComponent } from './contribution-line-detail.component';

describe('ContributionLineDetailComponent', () => {
  let component: ContributionLineDetailComponent;
  let fixture: ComponentFixture<ContributionLineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributionLineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
