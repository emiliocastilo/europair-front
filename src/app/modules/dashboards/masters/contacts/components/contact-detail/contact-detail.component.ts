import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
})
export class ContactDetailComponent implements OnInit {
  public contact: Contact;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contactsService: ContactsService
  ) { }

  ngOnInit(): void {
    this.getContact();
  }

  private getContact(): void {
    this.route.params.pipe(
        switchMap((params: Params) =>
          this.contactsService.getContactById(params.id)
        )
      ).subscribe((contact: Contact) => this.contact = contact);
  }

  public routeToBack(): string {
    return '/contacts';
  }
}
