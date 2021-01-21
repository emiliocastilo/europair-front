import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileAuditComponent } from './file-audit.component';


describe('FileAuditComponent', () => {
  let component: FileAuditComponent;
  let fixture: ComponentFixture<FileAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileAuditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
