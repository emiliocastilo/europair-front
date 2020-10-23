import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOperationComponent } from './confirm-operation.component';


describe('ConfirmOperationComponent', () => {
  let component: ConfirmOperationComponent;
  let fixture: ComponentFixture<ConfirmOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmOperationComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
