import { CurrencyEnum } from '../../../models/ContributionLine.model';

export interface Contribution {
  id?: number;
  fileId: number;
  routeId: number;
  contributionState: ContributionStates;
  operatorId: number;
  aircraftId: number;
  cargoAirborne?: number;
  quotedTime?: string;
  requestTime?: string;
  comments?: string;
  purchasePrice?: number;
  purchaseCommissionPercent?: number;
  salesPrice?: number;
  salesCommissionPercent?: number;
  salesPricewithoutIVA?: boolean;
  includedIva?: boolean;
  exchangeBuyType?: { code: string; description: string };
  currency?: CurrencyEnum;
  currencyOnSale?: CurrencyEnum;
}

export enum ContributionStates {
  PENDING = 'PENDING',
  SENDED = 'SENDED',
  QUOTED = 'QUOTED',
  CONFIRMED = 'CONFIRMED',
}
