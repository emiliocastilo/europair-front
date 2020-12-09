import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Condition } from '../../models/conditions';
import { ConditionsService } from '../../services/conditions.service';

@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit {
  public conditionId: number;
  public conditionForm = this.fb.group({
    code: ['', Validators.required],
    title: ['', Validators.required],
    conditionOrder: ['', Validators.required],
    description: ['', Validators.required]
  });
  public doc: string;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly conditionsService: ConditionsService
  ) { }

  ngOnInit(): void {
    this.getCondition();
  }

  private getCondition(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.conditionsService.getConditionById(params.id).subscribe((condition: Condition) => {
          this.conditionId = condition.id;
          this.conditionForm.patchValue({ ...condition });
        });
      }
    });
  }

  public saveCondition(): void {
    if (this.conditionForm.valid) {
      const condition: Condition = {
        id: this.conditionId,
        ...this.conditionForm.value
      };
      this.conditionsService.saveCondition(condition)
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
