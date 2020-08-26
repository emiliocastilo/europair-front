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
  daytimeConfiguration?: number;
  seatingF: number;
  seatingC: number;
  seatingY: number;
  nighttimeConfiguration: number;
  notes: any;
  tags: any;
  insideUpgradeYear: Date;
  outsideUpgradeYear: Date;
  observations: AircraftObservation[];
  pitch?: SeatsSettings;
  load?: Load;
}

export interface SeatsSettings {
  seatingF: number;
  seatingC: number;
  seatingY: number;
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

export interface AircraftObservation {
  id: number;
  observation: string;
}

export interface AircraftBase {
  id: number;
  airport: Airport;
  mainBase: boolean;
  type?: 'principal' | 'virtual';
}

export const EMPTY_AIRCRAFT = {
  id: null,
  operator: null,
  aircraftType: 1,
  bases: [],
  plateNumber: '',
  productionYear: 0,
  quantity: 0,
  insuranceEndDate: null,
  ambulance: false,
  daytimeConfiguration: 1,
  seatingF: 1,
  seatingC: 0,
  seatingY: 0,
  nighttimeConfiguration: 1,
  notes: '',
  tags: null,
  insideUpgradeYear: null,
  outsideUpgradeYear: null,
  observations: [],
};
