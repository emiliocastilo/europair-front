import { AircraftBase, Load } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Operator } from '../../masters/operators/models/Operator.model';

export interface Flight {
    id: number;
    operator: Operator;
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
    aircraftType: FleetType;
    quantity: number;
    load?: Load;
}
