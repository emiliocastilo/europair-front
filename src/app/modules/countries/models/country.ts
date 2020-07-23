export interface Country {
    id: number;
    code?: string;
    name?: string;
}

export const EMPTY_COUNTRY: Country = {
    id: undefined,
    code: '',
    name: ''
};

export interface CountryPageable {
    content: Array<Country>;
    pageable: {
        sort: Sort;
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

interface Sort { sorted: boolean; unsorted: boolean; empty: boolean; }
