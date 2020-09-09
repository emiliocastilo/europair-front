import { Audit } from '../../../../../core/models/audit/audit';

export interface Country extends Audit {
    id: number;
    code?: string;
    name?: string;
    europeanUnion?: boolean;
}

export const EMPTY_COUNTRY: Country = {
    id: undefined,
    code: '',
    name: '',
    europeanUnion: false,
    createdAt: null,
    createdBy : null,
    modifiedAt : null,
    modifiedBy : null
};