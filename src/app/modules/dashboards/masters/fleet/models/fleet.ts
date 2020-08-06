import { Audit } from 'src/app/core/models/audit/audit';

export interface Fleet {
    id: number;
    code?: string;
    name?: string;
}

export const EMPTY_FLEET: Fleet = {
    id: undefined,
    code: '',
    name: ''
};

export interface FleetCategory extends Audit {
    id: number;
    code?: string;
    name?: string;
}

export const EMPTY_FLEET_CATEGORY: FleetCategory = {
    id: null,
    code: '',
    name: '',
    createdAt: null,
    createdBy : null,
    modifiedAt : null,
    modifiedBy : null
};

export interface FleetSubcategory extends Audit {
    id: number;
    code?: string;
    name?: string;
    order?: number;
    category?: FleetCategory;
}

export const EMPTY_FLEET_SUBCATEGORY: FleetSubcategory = {
    id: null,
    code: '',
    name: '',
    order: 0,
    category: null,
    createdAt: null,
    createdBy : null,
    modifiedAt : null,
    modifiedBy : null
};

export interface FleetType extends Audit {
    id: number;
    code: string;
    description: string;
    producer: string;
    category: FleetCategory;
    subcategory: FleetSubcategory;
    flightRange: Measure;
    cabinInformation: CabinInformation;
    cargoInformation?: CargoInformation;
    averageSpeedPerDistanceRange?: Array<AverageSpeedPerDistanceRange>;
    observations?: Array<string>;

}

export interface CabinInformation {
    high: number;
    wide: number;
    long: number;
}

export interface CargoInformation {
    doorSize: number;
    maximumCargo: number;
    maximumVolume: number;
    observations: string;
    ULDCargo: number;
    palletCargo: number;
    looseCargo: number;
}

export interface AverageSpeedPerDistanceRange {
    distanceRange: {
        from: Measure;
        to: Measure;
    };
    averageSpeed: Measure;
}

export interface Measure {
    value: number; type: string;
}