import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel } from 'src/app/core/models/menus/left-sidebar.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'core-mobile-bar',
  templateUrl: './mobile-bar.component.html',
  styleUrls: ['./mobile-bar.component.scss']
})
export class MobileBarComponent {
  @Input() public menu: MenuModel;
  public collapseMenu: boolean;

  private elem: Element;
  private instance: M.Sidenav;

  constructor(private _authService: AuthService, private _router: Router){}

  ngAfterViewInit(): void {
    this.elem = document.querySelector('#mobile-demo');
    this.instance = M.Sidenav.init(this.elem, {});

  }

  public expandReduceMenu(): void {
    this.instance.isOpen ? this.instance.close() : this.instance.open();
  }

  public logout(): void {
    this._authService.closeSession();
    this._router.navigate(['/login']);
  }
}
