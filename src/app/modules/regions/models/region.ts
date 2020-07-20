import { Country } from '../../countries/models/country';
import { Airport } from './airport';

export interface Region {
  id: number;
  name: string;
  countries: Country[];
  airports: Airport[];
}

export const EMPTY_REGION: Region = {
  id: null,
  name: '',
  countries: [] as Country[],
  airports: [] as Airport[],
} as const;
