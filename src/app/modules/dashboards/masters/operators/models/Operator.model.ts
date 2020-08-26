import { Audit } from 'src/app/core/models/audit/audit';
import { Airport } from '../../regions/models/airport';

export interface Operator extends Audit {
  id?: number;
  iataCode: string;
  icaoCode: string;
  name: string;
  aocLastRevisionDate: any;
  aocNumber: number;
  insuranceExpirationDate: any;
  certifications: Certification[];
  observations: OperatorComment[];

  associatedContacts?: Contacts[];
  associatedFleet?: Fleet;
}

export interface Certification {
  id: number;
  airport: Airport;
  operator?: Operator;
  comments: string;
}

export interface OperatorComment {
  id: number;
  comment: string;
}

export interface Contacts {
  [key: string]: any;
}

export interface Fleet {
  [key: string]: any;
}

export const EMPTY_OPERATOR: Operator = {
  iataCode: '',
  icaoCode: '',
  name: '',
  aocLastRevisionDate: null,
  aocNumber: null,
  insuranceExpirationDate: null,
  certifications: [],
  observations: [],
};
