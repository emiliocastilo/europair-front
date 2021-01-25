import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAudit } from 'src/app/core/models/audit/base-audit';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-file-audit',
  templateUrl: './file-audit.component.html',
  styleUrls: ['./file-audit.component.scss'],
})
export class FileAuditComponent implements OnInit {

  private fileId: number;
  public fileAuditData: BaseAudit[];

  constructor(
    private readonly fileService: FilesService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.obtainParams();
  }


  private obtainParams(): void {
    this.route.params.subscribe((params: { fileId: string }) => {
      this.fileId = parseInt(params.fileId, 10);
      this.getAuditData(this.fileId);
    });
  }

  public getAuditData(fileId: number): void {
    this.fileService.getFileAudit(fileId).subscribe((auditData: BaseAudit[]) => this.fileAuditData = auditData);
  };

  public returnButton() {
    // Remove file-detail related queryparams before navigate to file list
    this.location.back();
    /*
    this.router.navigate(['files'], {
      queryParams: { ...this.route.snapshot.queryParams, expandedQuote: null },
      queryParamsHandling: 'merge'
    });
    */
  }

}
