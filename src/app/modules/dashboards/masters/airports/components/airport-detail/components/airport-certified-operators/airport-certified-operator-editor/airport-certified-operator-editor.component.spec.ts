import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportCertifiedOperatorEditorComponent } from './airport-certified-operator-editor.component';

describe('AirportCertifiedOperatorEditorComponent', () => {
  let component: AirportCertifiedOperatorEditorComponent;
  let fixture: ComponentFixture<AirportCertifiedOperatorEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportCertifiedOperatorEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportCertifiedOperatorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
