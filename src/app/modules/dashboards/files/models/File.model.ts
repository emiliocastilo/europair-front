import { HttpLoaderFactory } from 'src/app/app.module';
import { Country } from '../../masters/countries/models/country';

export interface File {
  id?: number;
  code?: string;
  description?: string;
  status?: FileStatus;
  client?: Client;
  contact?: Contact;
  provider?: Provider;
  salePerson?: string;
  saleAgent?: string;
  operationType?: string;
  observation?: string;
  statusId?: number;
  clientId?: number;
  contactId?: number;
  providerId?: number;
  salePersonId?: number;
  saleAgentId?: number;
  updatedAfterContractSigned?: boolean;
}

export interface FileStatus {
  id: number;
  code: FileStatusCode;
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
  code?: string;
  name?: string;
  canaryIslands?: boolean;
  vies?: boolean;
  country?: Country;
}

export enum OperationType {
  ACMI = 'ACMI',
  COMMERCIAL = 'COMMERCIAL',
  EXECUTIVE = 'EXECUTIVE',
  CHARGE = 'CHARGE',
  GROUP = 'GROUP',
}

export enum FileStatusCode {
  NEW_REQUEST = 'NEW_REQUEST',
  SALES = 'SALES',
  OPTIONED = 'OPTIONED',
  BLUE_BOOKED = 'BLUE_BOOKED',
  GREEN_BOOKED = 'GREEN_BOOKED',
  PREFLIGHT = 'PREFLIGHT',
  CNX = 'CNX',
  TEST_STATUS= 'TEST'
}

export interface ConfirmOperation {
  id?: number;
  flightMotive?: string;
  connections?: string;
  limitations?: string;
  fixedVariableFuel?: string;
  luggage?: string;
  specialLuggage?: string;
  onBoardService?: string;
  specialRequests?: string;
  otherCharges?: string;
  operationalInfo?: string;
  observation?: string;
}
