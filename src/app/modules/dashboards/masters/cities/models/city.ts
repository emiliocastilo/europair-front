import { Country } from '../../countries/models/country';


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