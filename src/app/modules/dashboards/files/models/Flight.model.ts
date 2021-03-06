import {
  AircraftBase,
  Load,
} from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Airport } from '../../masters/airports/models/airport';
import { Operator } from '../../masters/operators/models/Operator.model';

export interface Flight {
  id: number;
  order: number;
  operator: Operator;
  departureTime: string;
  arrivalTime: string;
  realDepartureTime: string;
  realArrivalTime: string;
  timeZone: string;
  origin: Airport;
  originId: number;
  destination: Airport;
  destinationId: number;
  seatsF: number;
  seatsC: number;
  seatsY: number;
  beds: number;
  stretchers: number;
  flightNumber: string;
  slot: CommonStatus;
  parking: CommonStatus;
  bases: AircraftBase[];
  aircraftType: FleetType;
  quantity: number;
  load?: Load;
  paxAD?: number;
  paxCHD?: number;
  paxInfants?: number;
}

// To reorder flights of a rotation
export interface FlightOrder {
  id: number;
  order: number;
}

export enum CommonStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}
