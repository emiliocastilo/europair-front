import { Injectable } from '@angular/core';
import { OperatorEnum } from '../models/search/operators-enum';
import { SearchFilter, FilterOptions } from '../models/search/search-filter';

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  constructor() {}

  public createHttpParams(
    searchFilter: SearchFilter,
    filterOptions: FilterOptions
  ): SearchFilter {
    const clonedSearchFilter = { ...searchFilter };
    Object.keys(searchFilter).forEach((key) => {
      if (clonedSearchFilter[key] === '') {
        delete clonedSearchFilter[key];
      } else {
        this.addFilterOptions(key, clonedSearchFilter, filterOptions);
      }
    });
    return clonedSearchFilter;
  }

  private addFilterOptions(
    key: string,
    searchFilter: SearchFilter,
    filterOptions: FilterOptions
  ): void {
    if (filterOptions[key] !== undefined && filterOptions[key] !== OperatorEnum.EMPTY) {
      searchFilter[key] = `${searchFilter[key]},${filterOptions[key]}`;
    }
  }
}
