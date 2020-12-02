import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Condition } from '../../models/conditions';
import { ConditionsService } from '../../services/conditions.service';

@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.scss'],
})
export class ConditionDetailComponent implements OnInit {
  public condition: Condition;
  public doc: string;  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly conditionsService: ConditionsService
  ) { }

  ngOnInit(): void {
    this.getCondition();
  }

  private getCondition(): void {
    this.route.params.pipe(
        switchMap((params: Params) =>
          this.conditionsService.getConditionById(params.id)
        )
      ).subscribe((condition: Condition) => this.condition = condition);
  }

  public routeToBack(): string {
    return '/conditions';
  }
}
