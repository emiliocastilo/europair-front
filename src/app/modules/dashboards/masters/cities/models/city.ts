import { Country } from '../../countries/models/country';
import { Audit } from '../../../../../core/models/audit/audit';

export interface City extends Audit {
    id: number;
    code: string;
    name: string;
    country: Country;
    canaryIslands?: boolean;
}


export const EMPTY_CITY: City = {
    id: undefined,
    code: '',
    name: '',
    country: {
        id: undefined,
        code: '',
        name: '',
        createdAt: null,
        createdBy : null,
        modifiedAt : null,
        modifiedBy : null
    },
    canaryIslands: false,
    createdAt: null,
    createdBy : null,
    modifiedAt : null,
    modifiedBy : null
};