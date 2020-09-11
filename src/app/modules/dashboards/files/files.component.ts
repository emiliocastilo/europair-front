import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  readonly icons = [
    'europair_add',
    'europair_add_more',
    'europair_add_trace',
    'europair_document',
    'europair_edit',
    'europair_line_break',
    'europair_plane',
    'europair_trace',
    'europair_trash',
  ];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.icons.forEach((i) => {
      iconRegistry.addSvgIcon(
        i,
        sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${i}.svg`)
      );
    });
  }
  ngOnInit(): void {}
}
