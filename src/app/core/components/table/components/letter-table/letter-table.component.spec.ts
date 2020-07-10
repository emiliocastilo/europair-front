import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterTableComponent } from './letter-table.component';

describe('LetterTableComponent', () => {
  let component: LetterTableComponent;
  let fixture: ComponentFixture<LetterTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
