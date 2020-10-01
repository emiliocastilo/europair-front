import { HttpParams } from '@angular/common/http';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';
import { FleetCategory, FleetSubcategory, FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
import { OperationType } from '../../../models/File.model';

export class AircraftFilter {
    routeId: number;
    countries: Array<Country>;
    airports: Array<Airport>;
    operators: Array<Operator>;
    fleetTypes: Array<FleetType>;
    category: FleetCategory;
    subcategory: FleetSubcategory;
    minumunSubcategory: boolean;
    nearbyAirport: boolean;
    nearbyAirportFrom: number;
    nearbyAirportTo: number;
    seatF: number;
    seatC: number;
    seatY: number;
    beds: number;
    stretchers: number;
    operationType: OperationType;
    flightScales: boolean;
    flightScalesValue: number;

    public getHttpParams(): HttpParams {
        let result: HttpParams = new HttpParams().set('routeId', this.routeId.toString());
        if (this.countries && this.countries.length > 0) {
            result = result.append('countryIds', this.getParamsFromArray(this.countries));
        }
        if (this.airports && this.airports.length > 0) {
            result = result.append('baseIds', this.getParamsFromArray(this.airports));
        }
        if (this.operators && this.operators.length > 0) {
            result = result.append('operators', this.getParamsFromArray(this.operators));
        }
        if (this.fleetTypes && this.fleetTypes.length > 0) {
            result = result.append('aircraftTypes', this.getParamsFromArray(this.fleetTypes));
        }
        if (this.nearbyAirport) {
            result = result.append('fromDistance', this.nearbyAirportFrom.toString());
            result = result.append('toDistance', this.nearbyAirportTo.toString());
            result = result.append('distanceUnit', 'KILOMETER');
        }
        if (this.flightScales) {
            result = result.append('flightScales', this.flightScalesValue.toString());
        }
        if (this.category) {
            result = result.append('categoryId', this.category.id.toString());
        }
        if (this.subcategory) {
            result = result.append('exactSubcategory', (!this.minumunSubcategory).toString());
            result = result.append('subcategoryId', this.subcategory.id.toString());
        }
        if (this.seatC || this.seatF || this.seatY) {
            result = result.append('seats', (this.seatC + this.seatF + this.seatY).toString());
        }
        if (this.beds) {
            result = result.append('beds', this.beds.toString());
        }
        if (this.stretchers) {
            result = result.append('stretchers', this.stretchers.toString());
        }
        if (this.operationType) {
            result = result.append('operationType', this.operationType.toString());
        }
        return result;
    }

    private getParamsFromArray(items: Array<Partial<{ id: number }>>): string {
        return items.map((item: { id: number }) => item.id).toString();
    }
}
