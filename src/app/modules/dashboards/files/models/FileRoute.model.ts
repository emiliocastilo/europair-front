import { Contribution } from '../components/search-aircraft/models/contribution.model';

export interface FileRoute {
  id: number;
  label: string;
  frequency: FrequencyType;
  frequencyDays: FrequencyDay[];
  startDate: Date;
  endDate: Date;
  rotations: FileRoute[];
  status?: RouteStatus;
  contributions?: Contribution[];
}

export interface FrequencyDay {
  id?: number;
  weekday?: unknown;
  monthDay?: number;
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum FrequencyType {
  ADHOC = 'ADHOC',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  DAY_OF_MONTH = 'DAY_OF_MONTH',
}

export const FREQUENCY_LIST = [
  FrequencyType.ADHOC,
  FrequencyType.BIWEEKLY,
  FrequencyType.DAILY,
  FrequencyType.DAY_OF_MONTH,
  FrequencyType.WEEKLY,
];

export const DAYS_LIST = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

export enum RouteStatus {
  SALES = 'SALES',
  WON = 'WON',
  LOST = 'LOST',
  LOST_EXPIRED = 'LOST_EXPIRED',
}
