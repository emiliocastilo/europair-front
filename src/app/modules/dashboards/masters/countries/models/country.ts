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