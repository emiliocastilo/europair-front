import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BarButton } from 'src/app/core/models/menus/button-bar/bar-button';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Contact } from './models/contact';
import { ContactsService } from './services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public contacts: Contact[];
  public contactDetailTitle: string;

  public columnToDisplay = ['code', 'name', 'alias', 'contactType', 'cmsCode', 'phoneNumber', 'mail'];
  public dataSource = new MatTableDataSource();
  public resultsLength: number = 0;
  public pageSize: number = 0;
  
  constructor(
    private readonly contactsService: ContactsService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initializeContactsTable();
  }
  private initializeContactsTable() {
    this.contactsService.getContacts().subscribe((data: Page<Contact>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.resultsLength = data.totalElements;
      this.pageSize = data.size;
    });
  }

  public goToDetail(contact: Contact): void {
    this.router.navigate(['contacts', contact.id]);
  }
}
