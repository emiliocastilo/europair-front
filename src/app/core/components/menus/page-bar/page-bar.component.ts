import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE_KEYS } from 'src/app/core/models/session-storage-keys';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'core-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.scss'],
})
export class PageBarComponent implements OnInit {
  @Input()
  public pageTitle: string;

  public userName: string;

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_NAME);
  }

  public logout(): void {
    this._authService.closeSession();
    this._router.navigate(['/login']);
  }
}
