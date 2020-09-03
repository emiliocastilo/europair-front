import { OperatorEnum } from './operators-enum';

export interface SearchFilter extends GenericFilter {}

export interface FilterOptions extends FilterOptionsType {}

export type GenericFilter = { [header: string]: string | string[] };

export type FilterOptionsType = { [key: string]: OperatorEnum };
