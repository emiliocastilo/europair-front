export interface City {
    code: string;
    name: string;
    country: Country;
}

export interface SaveCity {
    code: string;
    oldCode: string;
    name: string;
    country: Country;
}

export const EMPTY_CITY: City = {
    code: '',
    name: '',
    country: {
        code: '',
        name: ''
    }
};

export interface Country {
    code: string;
    name?: string;
}