import { Audit } from 'src/app/core/models/audit/audit';

export interface Operator extends Audit {
  id: number;
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
  airport: string;
  comment: string;
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
  id: undefined,
  iataCode: '',
  icaoCode: '',
  name: '',
  aocLastRevisionDate: '',
  aocNumber: null,
  insuranceExpirationDate: new Date(),
  certifications: [],
  observations: [],
  associatedContacts: [],
  associatedFleet: null,
  createdAt: null,
  createdBy: null,
  modifiedAt: null,
  modifiedBy: null,
};
