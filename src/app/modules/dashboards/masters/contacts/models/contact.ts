import { Role } from '../../roles/models/role';
import { Task } from '../../tasks/models/task';
import { Audit } from 'src/app/core/models/audit/audit';
import { City } from '../../cities/models/city';
import { Country } from '../../countries/models/country';

export interface Contact extends Audit {
  id?: number;
  code?: string;
  name?: string;
  crmCode?: string;
  contactType?: ContactType;
  companyCode?: string;
  companyName?: string;
  contactCategory?: ContactCategory;
  alias?: string;
  address?: string;
  cityId?: number;
  city?: City;
  postalCode?: string;
  province?: string;
  countryId?: number;
  country?: Country;
  commonOperationType?: OperationType;
  email?: string;
  phoneNumber?: string;
  mobilePhoneNumber?: string;
  faxNumber?: string;
  observation?: string;
}

enum ContactCategory {
  FLIGHT_PROVIDER = 'FLIGHT_PROVIDER',
  OPERATOR = 'OPERATOR',
  CLIENT = 'CLIENT',
  GENERAL_SERVICE_PROVIDER = 'GENERAL_SERVICE_PROVIDER',
  BROKER = 'BROKER',
  HANDLING_AGENT = 'HANDLING_AGENT',
  OTHER = 'OTHER'
}


export enum OperationType {
  ACMI = 'ACMI',
  COMMERCIAL = 'COMMERCIAL',
  EXECUTIVE = 'EXECUTIVE',
  FREIGHT = 'FREIGHT',
  GROUP = 'GROUP'
}

enum ContactType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINES = 'BUSINES'
}
