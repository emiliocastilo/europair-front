import { Audit } from 'src/app/core/models/audit/audit';
import { Airport } from '../../../../airports/models/airport';

export interface Aircraft extends Audit {
  id: number;
  operator: any;
  aircraftType: any;
  bases: AircraftBase[];
  plateNumber: string;
  productionYear: number;
  quantity: number;
  insuranceEndDate: Date;
  ambulance: boolean;
  daytimeConfiguration: number | SeatsSettings;
  nighttimeConfiguration: number;
  notes: any;
  tags: any;
  insideUpgradeDate: Date;
  outsideUpgradeDate: Date;
  observations: any;
  pitch?: SeatsSettings;
  load?: Load;
}

export interface SeatsSettings {
  seatsF: number;
  seatsC: number;
  seatsY: number;
}

export interface Load {
  frontDoorSize: number;
  maximumLoad: number /* (kg) */;
  maximumVolume: number /* (m^3) */;
  observations: any;
  loadULD: any;
  loadPallet: any;
  loadFree: any;
}

export interface AircraftBase {
  id: number;
  airport: Airport;
  mainBase: boolean;
  aircraft: Aircraft;
  type?: 'principal' | 'virtual';
}

export const EMPTY_AIRCRAFT = {
  id: null,
  operator: null,
  aircraftType: null,
  bases: [],
  plateNumber: '',
  productionYear: 0,
  quantity: 0,
  insuranceEndDate: null,
  ambulance: false,
  daytimeConfiguration: 0,
  nighttimeConfiguration: 0,
  notes: '',
  tags: null,
  insideUpgradeDate: null,
  outsideUpgradeDate: null,
  observations: [],
  createdAt: null,
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
};
