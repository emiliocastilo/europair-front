import { HttpParams } from '@angular/common/http';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';
import { FleetCategory, FleetSubcategory, FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';

export class AircraftSearch {
    countries: Array<Country>;
    airports: Array<Airport>;
    operators: Array<Operator>;
    categories: Array<FleetCategory>;
    subcategories: Array<FleetSubcategory>;
    fleetTypes: Array<FleetType>;
    nearbyAirport: boolean;
    nearbyAirportFrom: number;
    nearbyAirportTo: number;
    seatF: number;
    seatC: number;
    seatY: number;
    beds: number;
    stretchers: number;

    public getHttpParams(): HttpParams {
        let result: HttpParams = new HttpParams();
        if (this.countries && this.countries.length > 0) {
            result = result.append('countryId', this.getParamsFromArray(this.countries));
        }
        if (this.airports && this.airports.length > 0) {
            result = result.append('airportId', this.getParamsFromArray(this.airports));
        }
        if (this.operators && this.operators.length > 0) {
            result = result.append('operatorId', this.getParamsFromArray(this.operators));
        }
        if (this.categories && this.categories.length > 0) {
            result = result.append('categoryId', this.getParamsFromArray(this.categories));
        }
        if (this.subcategories && this.subcategories.length > 0) {
            result = result.append('subcategoryId', this.getParamsFromArray(this.subcategories));
        }
        if (this.fleetTypes && this.fleetTypes.length > 0) {
            result = result.append('fleetTypeId', this.getParamsFromArray(this.fleetTypes));
        }
        if (this.nearbyAirport) {
            result = result.append('nearbyAirportFrom', this.nearbyAirportFrom.toString());
            result = result.append('nearbyAirportTo', this.nearbyAirportTo.toString());
        }
        if (this.seatC) {
            result = result.append('seatC', this.seatC.toString());
        }
        if (this.seatF) {
            result = result.append('seatF', this.seatF.toString());
        }
        if (this.seatY) {
            result = result.append('seatY', this.seatY.toString());
        }
        if (this.beds) {
            result = result.append('beds', this.beds.toString());
        }
        if (this.stretchers) {
            result = result.append('stretchers', this.stretchers.toString());
        }
        result = result.append('bases', "1");
        return result;
    }

    private getParamsFromArray(items: Array<Partial<{id: number}>>): string {
        return items.map((item: {id: number}) => item.id).toString();
    }
}
