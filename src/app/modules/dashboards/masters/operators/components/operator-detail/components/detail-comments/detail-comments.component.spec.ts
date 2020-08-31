import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCommentsComponent } from './detail-comments.component';

describe('DetailCommentsComponent', () => {
  let component: DetailCommentsComponent;
  let fixture: ComponentFixture<DetailCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
