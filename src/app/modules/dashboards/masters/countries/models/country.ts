import { Audit } from '../../../../../core/models/audit/audit';

export interface Country extends Audit {
    id: number;
    code?: string;
    name?: string;
}

export const EMPTY_COUNTRY: Country = {
    id: undefined,
    code: '',
    name: '',
    createdAt: null,
    createdBy : null,
    modifiedAt : null,
    modifiedBy : null
};