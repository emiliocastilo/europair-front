import { Country } from '../../countries/models/country'
import { City } from '../../cities/models/city'

export interface Airport {
    id: number;
    name?: string;
    codIATA?: string;
    codICAO?: string;
    country?: Country;
    city?: City;
    timeZone?: string;
    elevation?: number;
    location?: {
        latitude: number,
        longitude: number
    };
    customs?: boolean;
    specialConditions?: boolean;
    flightRulesType?: FlightRulesType;
    trackInformation?: Array<Track>;
    terminals?: Array<Terminal>;
    operators?: Array<Operator>;
    observations?: string;
}

export enum FlightRulesType{
    IFR = 'IFR',
    VFR = 'VFR'
}

export interface Track {
    id: number;
    length?: number;
    width?: number;
    observation?: string;
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
export const EMPTY_COUNTRY: Airport = {
    id: undefined,
    name: ''
};