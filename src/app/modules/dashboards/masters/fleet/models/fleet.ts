import { Audit } from 'src/app/core/models/audit/audit';
import { MeasureType } from 'src/app/core/models/base/measure';
export interface Fleet {
  id: number;
  code?: string;
  name?: string;
}

export const EMPTY_FLEET: Fleet = {
  id: undefined,
  code: '',
  name: '',
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
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
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
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
};

export interface FleetType extends Audit {
  id: number;
  iataCode: string;
  icaoCode: string;
  code: string;
  description: string;
  manufacturer: string;
  category: FleetCategory;
  subcategory: FleetSubcategory;
  flightRange: number;
  flightRangeUnit: MeasureType;
  cabinWidth: number;
  cabinWidthUnit: MeasureType;
  cabinHeight: number;
  cabinHeightUnit: MeasureType;
  cabinLength: number;
  cabinLengthUnit: MeasureType;
  maxCargo: number;
  averageSpeed: AverageSpeed[];
  observations: FleetTypeObservation[];
}

export interface FleetTypeObservation {
  id: number;
  observation: string;
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

export interface AverageSpeed {
  id: number;
  fromDistance: number;
  toDistance: number;
  distanceUnit: MeasureType;
  averageSpeed: number;
  averageSpeedUnit: MeasureType;
}

export const EMPTY_FLEET_TYPE: FleetType = {
  id: undefined,
  iataCode: '',
  icaoCode: '',
  code: '',
  description: '',
  manufacturer: '',
  category: EMPTY_FLEET_CATEGORY,
  subcategory: EMPTY_FLEET_SUBCATEGORY,
  flightRange: null,
  flightRangeUnit: null,
  cabinWidth: null,
  cabinWidthUnit: null,
  cabinHeight: null,
  cabinHeightUnit: null,
  cabinLength: null,
  cabinLengthUnit: null,
  maxCargo: null,
  averageSpeed: [],
  observations: [],
  createdAt: null,
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
};

export const EMPTY_FLEET_TYPE_SPEED: AverageSpeed = {
  id: undefined,
  fromDistance: null,
  toDistance: null,
  distanceUnit: null,
  averageSpeed: null,
  averageSpeedUnit: null,
};
