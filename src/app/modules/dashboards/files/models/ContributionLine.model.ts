import { FileRoute } from './FileRoute.model';

export interface ContributionLine {
  id: number;
  contributionId: number;
  routeId: number;
  route: FileRoute;
  comments: string;
  price: number;
  lineContributionRouteType: LineContributionRouteType;
  type: ServiceTypeEnum;
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
  ZAR = 'ZAR', // Rand sudáfricano
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
  { value: CurrencyEnum.ZAR, description: 'CURRENCIES.ZAR' },
];

export enum LineContributionRouteType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}

export enum ServiceTypeEnum {
  FLIGHT = 'VUE',
  CARGO = 'CAR',
  COMMISSION = 'COM',
  TRANSPORT = 'TRA',
  AIRPORT_TAX = 'ATX',
  EXTRAS_ON_BOARD = 'EOB',
  EXTRAS_ON_GROUND = 'EOG',
  CATERING_ON_BOARD = 'COB',
  CATERING_ON_GROUND = 'COG',
  CANCEL_FEE = 'CNX',
}
