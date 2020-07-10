import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBarComponent } from './page-bar.component';

describe('PageBarComponent', () => {
  let component: PageBarComponent;
  let fixture: ComponentFixture<PageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
