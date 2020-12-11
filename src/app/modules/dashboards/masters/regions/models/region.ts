import { Airport } from '../../airports/models/airport';
import { Country } from '../../countries/models/country';

export interface Region {
  id: number;
  code: string;
  name: string;
  countries: Country[];
  airports: Airport[];
}

export const EMPTY_REGION: Region = {
  id: null,
  code: '',
  name: '',
  countries: [] as Country[],
  airports: [] as Airport[],
} as const;
