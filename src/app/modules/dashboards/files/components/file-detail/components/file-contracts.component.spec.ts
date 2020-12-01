import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileContractsComponent } from './file-contracts.component';


describe('FileContractsComponent', () => {
  let component: FileContractsComponent;
  let fixture: ComponentFixture<FileContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
