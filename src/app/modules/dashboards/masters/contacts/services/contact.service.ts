import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/table/pagination/page';
import { Contact } from '../models/contact';
import { OperatorEnum } from 'src/app/core/models/search/operators-enum';
import { FilterOptions, SearchFilter } from 'src/app/core/models/search/search-filter';
import { SearchFilterService } from 'src/app/core/services/search-filter.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private readonly mocked: boolean = environment.mock;
  private readonly url = `${environment.apiUrl}contacts`;
  private readonly filterOptions: FilterOptions = {
    filter_name: OperatorEnum.CONTAINS,
  } as const;

  
  constructor(
    private http: HttpClient,
    private searchFilterService: SearchFilterService
  ) {}

  public getContacts(searchFilter: SearchFilter = {}): Observable<Page<Contact>> {
    const url: string = this.mocked ? '/assets/mocks/contacts.json' : this.url;
    return this.http.get<Page<Contact>>(url, {
      params: this.searchFilterService.createHttpParams(
        searchFilter,
        this.filterOptions
      ),
    });
  }

  public getContactById(contactId: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.url}/${contactId}`);
  }

  public saveContact(user: Contact): Observable<Contact> {
    return user.id !== null ? this.updateContact(user) : this.createContact(user);
  }

  private createContact(user: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.url, user);
  }

  private updateContact(user: Contact): Observable<Contact> {
    const updateContactUrl = `${this.url}/${user.id}`;
    return this.http.put<Contact>(updateContactUrl, user);
  }

  public removeContact(user: Contact) {
    const removeContactUrl = `${this.url}/${user.id}`;
    return this.http.delete(removeContactUrl);
  }
}
