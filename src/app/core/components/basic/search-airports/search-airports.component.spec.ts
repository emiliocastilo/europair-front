import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAirportsComponent } from './search-airports.component';

describe('SelectComponent', () => {
  let component: SearchAirportsComponent;
  let fixture: ComponentFixture<SearchAirportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAirportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAirportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
