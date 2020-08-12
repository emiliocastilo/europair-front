import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportRegionEditorComponent } from './airport-region-editor.component';

describe('AirportRegionEditorComponent', () => {
  let component: AirportRegionEditorComponent;
  let fixture: ComponentFixture<AirportRegionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportRegionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportRegionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
