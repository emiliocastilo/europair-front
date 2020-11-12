import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightTrackingDetailComponent } from './flight-tracking-detail.component';


describe('FlightTrackingDetailComponent', () => {
  let component: FlightTrackingDetailComponent;
  let fixture: ComponentFixture<FlightTrackingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTrackingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTrackingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
