import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { EMPTY_SERVICE, Services, ServiceType } from '../../models/services.model';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
})
export class ServiceDetailComponent implements OnInit {
  public pageTitle: string;
  public service: Services;
  private unsubscribe$: Subject<void> = new Subject();
  public servicesForm: FormGroup = this.formBuilder.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    type: ['', Validators.required]
  });

  public serviceTypeOptions: Array<{ value: ServiceType, description: string }>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly servicesService: ServicesService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.service = EMPTY_SERVICE;
    this.initializeServiceData(this.route.snapshot.data);
    this.generateServiceTypeOptions();
  }

  private initializeServiceData({ title, isServiceDetail }: any) {
    this.pageTitle = title;
    if (isServiceDetail) {
      this.route.params
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ id }) => {
          this.getService(id);
        });
    }
  }

  private getService(serviceId): void {
    this.servicesService.getServiceById(serviceId).subscribe((service: Services) => {
      this.service = service;
      this.servicesForm.patchValue(this.service);
    });
  }

  private generateServiceTypeOptions(): void {
    this.serviceTypeOptions = Object.keys(ServiceType).map((serviceType) => {
      return { value: ServiceType[serviceType], description: this.translateService.instant(`SERVICES.TYPES.${ServiceType[serviceType]}`) }
    });
  }

  public saveService(): void {
    this.service = {
      ...this.service,
      ...this.servicesForm.value
    };
    this.servicesService.saveService(this.service).subscribe(() => this.router.navigate([this.routeToBack()]));
  }

  public routeToBack(): string {
    return '/services';
  }

  public hasControlAnyError(controlName: string): boolean {
    const control = this.servicesForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  public hasControlSpecificError(controlName: string, errorName: string): boolean {
    const control = this.servicesForm.get(controlName);
    return control && control.hasError(errorName);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
