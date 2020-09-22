import { AircraftBase, Load } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { FleetCategory, FleetSubcategory, FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';

export interface AircraftSearchResult {
    id: number;
    operator: Operator;
    aircraftType: FleetType;
    aircraftCategory: FleetCategory;
    aircraftSubcategory: FleetSubcategory;
    bases: Array<AircraftBase>;
    insuranceEndDate: Date;
    quantity: number;
    seatingF: number;
    seatingC: number;
    seatingY: number;
    beds: number;
    stretchers: number;
    daytimeConfiguration: number;
    nighttimeConfiguration: number;
    observations: Array<{ id: number, observation: string }>;
    timeInHours: number;
    load: Load; // TODO: falta en back
}
