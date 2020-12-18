import { TimeZone } from 'src/app/core/models/base/time-zone';
import { Contract, CurrencyEnum } from '../../../models/Contract.model';

export interface ContractConfiguration {
    id: number;
    contractId: number;
    contract: Contract;
    language: string;
    timezone: TimeZone;
    paymentConditionsId: number;
    paymentConditions: string;
    paymentConditionsObservation: string;
    currency: CurrencyEnum;
    deposit: number;
    depositExpirationDate: string;
}

export enum ContractConfigTimezoneEnum {
  UTC = 'UTC',
  LOCAL = 'LOCAL'
}

export const CONTRACT_HOURS_CONFIG = [
  {name: ContractConfigTimezoneEnum.LOCAL, description: 'Local'},
  {name: ContractConfigTimezoneEnum.UTC, description: 'UTC'},
] as const;