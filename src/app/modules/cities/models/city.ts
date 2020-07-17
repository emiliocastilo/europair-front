export interface City {
    id: number;
    code: string;
    name: string;
    country: Country;
}


export const EMPTY_CITY: City = {
    id: undefined,
    code: '',
    name: '',
    country: {
        id: undefined,
        code: '',
        name: ''
    }
};

export interface Country {
    id: number;
    code?: string;
    name?: string;
}

export interface Pageable<T> {
    content: Array<T>;
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
