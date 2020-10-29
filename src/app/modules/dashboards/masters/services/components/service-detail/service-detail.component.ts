import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { Services } from '../../models/services.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent implements OnInit {
  public service: Services;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly servicesService: ServicesService
  ) { }

  ngOnInit(): void {
    this.getService();
  }

  private getService(): void {
    this.route.params.pipe(
      switchMap((params: Params) => this.servicesService.getServiceById(params.id))
    ).subscribe((service: Services) => this.service = service);
     /* SERVICE MOCKED
    this.route.params.subscribe((param: Params) => {
      this.servicesService.getServices()
        .subscribe((pageService: Page<Services>) => this.service = pageService.content.find((service: Services) => service.id == param.id));
    });*/
  }

  public routeToBack(): string {
    return '/services';
  }
}
