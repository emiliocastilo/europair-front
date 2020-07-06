import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnActionsComponent } from './column-actions.component';

describe('ColumnActionsComponent', () => {
  let component: ColumnActionsComponent;
  let fixture: ComponentFixture<ColumnActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
