import { Country } from '../../countries/models/country'
import { City } from '../../cities/models/city'
import { Measure } from 'src/app/core/models/base/measure';
import { Audit } from 'src/app/core/models/audit/audit';

export interface Airport extends Audit {
    id: number;
    name?: string;
    iataCode?: string;
    icaoCode?: string;
    country?: Country;
    city?: City;
    timeZone?: string;
    elevation?: Measure;
    latitude?: number;
    longitude?: number;
    customs?: CustomsType;
    simpleCustoms?: boolean;
    specialConditions?: boolean;
    flightRulesType?: FlightRulesType;
    runways?: Array<Track>;
    terminals?: Array<Terminal>;
    operators?: Array<Operator>;
    observations?: string;
    balearics?: boolean;
    canary_islands?: boolean;
}

export enum FlightRulesType {
    IFR = 'IFR',
    VFR = 'VFR'
}

export enum CustomsType {
    YES = 'YES',
    NO = 'NO',
    ON_REQUEST = 'ON_REQUEST'
}

export interface Track {
    id: number;
    name?: string;
    length?: Measure;
    width?: Measure;
    observation?: string;
    mainRunway?: boolean;
}

export interface Terminal {
    id: number;
    code?: string;
    name?: string;
    observation?: string;
}

export interface Operator {
    id: number;
    code?: string;
    observation?: string;
}

export interface Observation {
    id: number;
    observation: string;
}

export const EMPTY_AIRPORT: Airport = {
    id: null,
    name: '',
    createdAt: null,
    createdBy: null,
    modifiedAt: null,
    modifiedBy: null,
} as const;
