import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalServiceComponent } from './additional-services.component';

describe('AdditionalServiceComponent', () => {
  let component: AdditionalServiceComponent;
  let fixture: ComponentFixture<AdditionalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
