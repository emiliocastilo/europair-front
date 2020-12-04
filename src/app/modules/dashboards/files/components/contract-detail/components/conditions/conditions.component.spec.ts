import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractConditionComponent } from './conditions.component';


describe('ContractConditionComponent', () => {
  let component: ContractConditionComponent;
  let fixture: ComponentFixture<ContractConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
