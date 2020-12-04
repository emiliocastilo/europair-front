import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Page } from 'src/app/core/models/table/pagination/page';
import { CancellationFees } from '../../models/cancellation-fees.model';
import { CancellationFeesService } from '../../services/cancellation-fees.service';

@Component({
  selector: 'app-cancellation-fees',
  templateUrl: './cancellation-fees.component.html',
  styleUrls: ['./cancellation-fees.component.scss'],
})
export class CancellationFeesComponent implements OnInit {
  public cancellationFees: Array<CancellationFees>;
  public contractId: number;
  public fileId: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cancellationFeesService: CancellationFeesService
  ) { }

  ngOnInit(): void {
    this.getCancellationFees();
  }

  private getCancellationFees(): void {
    this.route.params.subscribe((params: Params) => {
      this.fileId = +params.fileId;
      this.contractId = +params.contractId;
      this.cancellationFeesService.getCancellationFees({ 'filter_contract.id': params.contractId })
        .subscribe((page: Page<CancellationFees>) => {
          this.cancellationFees = page.content;
        });
    });
  }

  public routeToBack(): string {
    return `/files/${this.fileId}/contracts/${this.contractId}`;
  }
}
