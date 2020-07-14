export interface Country {
    code: string;
    name: string;
}

export interface SaveCountry {
    code: string;
    oldCode: string;
    name: string;
}

export const EMPTY_COUNTRY: Country = {
    code: '',
    name: ''
};