import { Audit } from 'src/app/core/models/audit/audit';
import { Airport } from '../../../../airports/models/airport';

export interface Aircraft extends Audit {
  id: number;
  operator: any;
  type: any;
  basesList: Base[];
  enrollment: any;
  productionYear: any;
  quantity: any;
  insuranceExpiration: any;
  daySettings: number | SeatsSettings;
  ambulance: boolean;
  nightSettings: number;
  notes: any;
  tags: any;
  lastInteriorReform: any;
  lastExteriorReform: any;
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

export interface Base {
  airport: Airport;
  type: 'principal' | 'virtual';
}

export const EMPTY_AIRCRAFT = {
  id: null,
  operator: null,
  type: null,
  basesList: [],
  enrollment: null,
  productionYear: 0,
  quantity: 0,
  insuranceExpiration: null,
  daySettings: 0,
  ambulance: false,
  nightSettings: 0,
  notes: null,
  tags: null,
  lastInteriorReform: null,
  lastExteriorReform: null,
  observations: null,
  createdAt: null,
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
};
