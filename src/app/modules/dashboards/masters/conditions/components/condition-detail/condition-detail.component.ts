import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContractCondition } from 'src/app/modules/dashboards/files/components/contract-detail/models/contract-condition.model';
import { ContractConditionsService } from 'src/app/modules/dashboards/files/components/contract-detail/services/contract-condition.service';

@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit {
  public conditionForm = this.fb.group({
    id: [null],
    code: ['', Validators.required],
    title: ['', Validators.required],
    conditionOrder: ['', Validators.required],
    description: ['']
  });
  public doc: string;

  public quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link']                         // link and image, video
    ]
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly conditionsService: ContractConditionsService
  ) { }

  ngOnInit(): void {
    this.getCondition();
  }

  private getCondition(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.conditionsService.getContractConditionById(params.id).subscribe((condition: ContractCondition) => {
          this.conditionForm.patchValue({ ...condition });
        });
      }
    });
  }

  public saveCondition(): void {
    this.conditionForm.markAllAsTouched();
    if (this.conditionForm.valid) {
      this.conditionsService.saveContractCondition(this.conditionForm.value)
        .subscribe(() => this.router.navigate([this.routeToBack()]));
    }
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.conditionForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.conditionForm.get(controlName);
    return control && control.hasError(errorName);
  }

  public routeToBack(): string {
    return '/conditions';
  }
}
