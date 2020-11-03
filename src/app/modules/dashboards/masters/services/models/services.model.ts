import { Audit } from 'src/app/core/models/audit/audit';

export interface Services extends Audit {
    id: number;
    code: string;
    name: string;
    type?: ServiceType;
}

export const EMPTY_SERVICE: Services = {
    id: null,
    name: '',
    code: '',
    createdAt: null,
    createdBy: null,
    modifiedAt: null,
    modifiedBy: null
} as const;


export enum ServiceType {
    FLIGHT = 'FLIGHT',
    CARGO = 'CARGO',
    COMMISSION = 'COMMISSION',
    TRANSPORT = 'TRANSPORT',
    AIRPORT_TAX = 'AIRPORT_TAX',
    EXTRAS_ON_BOARD = 'EXTRAS_ON_BOARD',
    EXTRAS_ON_GROUND = 'EXTRAS_ON_GROUND',
    CATERING_ON_BOARD = 'CATERING_ON_BOARD',
    CATERING_ON_GROUND = 'CATERING_ON_GROUND',
    CANCEL_FEE = 'CANCEL_FEE'
}