import { Aircraft } from 'src/app/modules/dashboards/masters/fleet/components/aircraft/models/Aircraft.model';
import { Operator } from 'src/app/modules/dashboards/masters/operators/models/Operator.model';
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
  purchaseComments?: string;
  purchasePrice?: number;
  purchaseCommissionPercent?: number;
  salesComments?: string;
  salesPrice?: number;
  salesCommissionPercent?: number;
  salesPricewithoutIVA?: boolean;
  includedIva?: boolean;
  exchangeBuyType?: { code: string; description: string };
  currency?: CurrencyEnum;
  currencyOnSale?: CurrencyEnum;
  operator?: Operator;
  aircraft?: Aircraft;
  seatingC?: number;
  seatingF?: number;
  seatingY?: number;
}

export enum ContributionStates {
  PENDING = 'PENDING',
  SENDED = 'SENDED',
  QUOTED = 'QUOTED',
  CONFIRMED = 'CONFIRMED',
}
