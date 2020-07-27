import { Airport } from './airport';
import { Country } from '../../countries/models/country';

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
