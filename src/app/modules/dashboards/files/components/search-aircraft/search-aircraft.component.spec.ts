import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAircraftComponent } from './search-aircraft.component';

describe('SearchAircraftComponent', () => {
  let component: SearchAircraftComponent;
  let fixture: ComponentFixture<SearchAircraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAircraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAircraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
