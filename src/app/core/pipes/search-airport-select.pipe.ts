import { Pipe, PipeTransform } from '@angular/core';
import { Airport } from 'src/app/modules/dashboards/masters/airports/models/airport';

@Pipe({
  name: 'searchAirportSelectPipe',
})
export class SearchAirportSelectPipe implements PipeTransform {
  transform(airport: Airport, params: {term: string}): string {
    const searchTerm: string = params.term.toUpperCase();

    let iata: string = airport.iataCode;
    let icao: string = airport.icaoCode;
    let name: string = airport.name;

    iata = iata?.replace(searchTerm, `<b>${searchTerm}</b>`);
    icao = icao?.replace(searchTerm, `<b>${searchTerm}</b>`);
    name = name?.replace(searchTerm, `<b>${searchTerm}</b>`);

    iata = iata ? `${iata} - ` : '';
    icao = icao ? `${icao} - ` : '';
    name = name ? `${name}` : '';

    return airport ? `${iata}${icao}${name}` : null;
  }
}
