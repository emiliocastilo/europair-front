import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationFeesDetailComponent } from './cancellation-fees.component';

describe('CancellationFeesDetailComponent', () => {
  let component: CancellationFeesDetailComponent;
  let fixture: ComponentFixture<CancellationFeesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationFeesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationFeesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
