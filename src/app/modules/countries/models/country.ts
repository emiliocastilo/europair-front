export interface Country {
    id: number;
    code: string;
    name: string;
}

export const EMPTY_COUNTRY: Country = {
    id: undefined,
    code: '',
    name: ''
};

export interface CountryPageable {
    content: Array<Country>;
    pageable: any;
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
