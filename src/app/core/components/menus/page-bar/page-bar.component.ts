import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'core-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.scss'],
})
export class PageBarComponent implements OnInit {
  @Input()
  public pageTitle: string;
  @Input()
  public userData: any;

  constructor(private _authService: AuthService, private _router:Router) {}

  ngOnInit(): void {}

  public logout():void{
    this._authService.closeSession();
    this._router.navigate(['/login']);
  }
}
