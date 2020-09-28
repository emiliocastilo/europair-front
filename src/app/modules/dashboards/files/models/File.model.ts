import { Country } from '../../masters/countries/models/country';

export interface File {
  id: number;
  code: string;
  description: string;
  status: FileStatus;
  client: Client;
  contact: Contact;
  provider: Provider;
  salePerson: string;
  saleAgent: string;
  operationType: string;
}

export interface FileStatus {
  id: number;
  code: string;
  name: string;
}

export interface Contact {
  id: number;
  code: string;
  name: string;
}

export interface Client {
  id: number;
  code: string;
  name: string;
  type: string;
  canaryIslands: boolean;
  vies: boolean;
  country: Country;
}

export interface Provider {
  id: number;
  code: string;
  name: string;
  canaryIslands: boolean;
  vies: boolean;
  country: Country;
}

export enum OperationType {
  ACMI = 'ACMI',
  COMMERCIAL = 'COMMERCIAL',
  EXECUTIVE = 'EXECUTIVE',
  CHARGE = 'CHARGE',
  GROUP = 'GROUP'
}
