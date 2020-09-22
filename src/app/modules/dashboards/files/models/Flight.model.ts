import { Operator } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { AircraftBase, Load } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';

export interface Flight {
    id: number;
    departureTime: string;
    timeZone: string;
    origin: string;
    destination: string;
    seatsF: number;
    seatsC: number;
    seatsY: number;
    beds: number;
    stretchers: number;
    bases: AircraftBase[];
    operator: Operator;
    aircraftType: FleetType;
    quantity: number;
    load?: Load;
}
