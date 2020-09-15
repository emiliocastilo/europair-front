import { HttpParams } from '@angular/common/http';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';
import { Country } from 'src/app/modules/dashboards/masters/countries/models/country';
import { FleetCategory, FleetSubcategory, FleetType } from 'src/app/modules/dashboards/masters/fleet/models/fleet';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';

export class AircraftSearch {
    country: Country;
    airport: Airport;
    operator: Operator;
    category: FleetCategory;
    subcategory: FleetSubcategory;
    fleetType: FleetType;
    nearbyAirportFrom: number;
    nearbyAirportTo: number;
    passengers: number;

    public getHttpParams(): HttpParams {
        const result: HttpParams = new HttpParams();
        if (this.country) {
            result.append('countryId', this.country.id.toString());
        }
        if (this.airport) {
            result.append('airportId', this.airport.id.toString());
        }
        if (this.operator) {
            result.append('operatorId', this.operator.id.toString());
        }

        if (this.category) {
            result.append('categoryId', this.category.id.toString());
        }

        if (this.subcategory) {
            result.append('subcategoryId', this.subcategory.id.toString());
        }

        if (this.fleetType) {
            result.append('fleetTypeId', this.fleetType.id.toString());
        }

        if (this.nearbyAirportFrom) {
            result.append('nearbyAirportFrom', this.nearbyAirportFrom.toString());
        }

        if (this.nearbyAirportTo) {
            result.append('nearbyAirportTo', this.nearbyAirportTo.toString());
        }

        if (this.passengers) {
            result.append('passengers', this.passengers.toString());
        }

        return result;
    }
}
