import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCertificationsComponent } from './detail-certifications.component';

describe('DetailCertificationsComponent', () => {
  let component: DetailCertificationsComponent;
  let fixture: ComponentFixture<DetailCertificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCertificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
