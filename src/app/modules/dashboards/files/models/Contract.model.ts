import { ServiceType } from '../../masters/services/models/services.model';
import { ContractCondition } from '../components/contract-detail/models/contract-condition.model';
import { ContractConfiguration } from '../components/contract-detail/models/contract-configuration.model';
import { Client, Provider } from './File.model';
import { FileRoute } from './FileRoute.model';

export interface Contract {
  id?: number;
  code?: number;
  signatureDate?: string;
  issueDate?: string;
  operative?: string;
  contractType?: ContractType;
  contractState?: ContractStates;
  contractLines?: Array<ContractLine>;
  contractDate?: string;
  provider?: Provider;
  client?: Client;
  amount?: string;
  contractConfiguration?: ContractConfiguration;
  condition?: string;
  cancelationFees?: number;
  fileId?: number;
  routeId?: number;
  conditions?: Array<ContractCondition>
}

export enum ContractType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE'
}


export enum ContractStates {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  CANCELED = 'CANCELED'
}

export const CONTRACT_STATES: ContractStates[] = [
  ContractStates.PENDING,
  ContractStates.SIGNED,
  ContractStates.CANCELED
];


export interface ContractLine {
  id: number;
  contractId: number;
  routeId: number;
  flightId: number;
  route?: FileRoute;
  comments: string;
  price: number;
  lineContractRouteType: LineContractRouteType;
  type: ServiceType;
}

export interface RotationContractLine {
  contractLine: ContractLine;
  rotation: string;
  price: number;
}

export enum CurrencyEnum {
  AUD = 'AUD', // Dolar australiano
  CHF = 'CHF', // Franco suizo
  DKK = 'DKK', // Corona danesa
  EUR = 'EUR', // Euro
  GBP = 'GBP', // Libra esterlina
  NOK = 'NOK', // Corona noruega
  PLN = 'PLN', // Zloty polaco
  RUR = 'RUR', // Rublo ruso
  SEK = 'SEK', // Corona sueca
  THB = 'THB', // Baht de Tailandia
  USD = 'USD', // Dólar de EE.UU.
  ZAR = 'ZAR' // Rand sudáfricano
}

export interface Currency {
  value: CurrencyEnum;
  description: string;
}

export const CURRENCIES: Currency[] = [
  { value: CurrencyEnum.AUD, description: 'CURRENCIES.AUD' },
  { value: CurrencyEnum.CHF, description: 'CURRENCIES.CHF' },
  { value: CurrencyEnum.DKK, description: 'CURRENCIES.DKK' },
  { value: CurrencyEnum.EUR, description: 'CURRENCIES.EUR' },
  { value: CurrencyEnum.GBP, description: 'CURRENCIES.GBP' },
  { value: CurrencyEnum.NOK, description: 'CURRENCIES.NOK' },
  { value: CurrencyEnum.PLN, description: 'CURRENCIES.PLN' },
  { value: CurrencyEnum.RUR, description: 'CURRENCIES.RUR' },
  { value: CurrencyEnum.SEK, description: 'CURRENCIES.SEK' },
  { value: CurrencyEnum.THB, description: 'CURRENCIES.THB' },
  { value: CurrencyEnum.USD, description: 'CURRENCIES.USD' },
  { value: CurrencyEnum.ZAR, description: 'CURRENCIES.ZAR' }
];

export enum LineContractRouteType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE'
}
