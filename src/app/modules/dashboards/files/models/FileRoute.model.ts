export interface FileRoute {
  id: number;
  code: string;
  frequency: FrequencyType;
  frequencyDays: FrequencyDay[];
  initialDate: Date;
  endDate: Date;
  rotations: FileRoute[];
}

export interface FrequencyDay {
  id: number;
  weekday: DayOfWeek;
  monthDay: number;
}

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
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

export const DAYS_LIST = new Map<DayOfWeek, string>([
  [DayOfWeek.MONDAY, 'MONDAY'],
  [DayOfWeek.TUESDAY, 'TUESDAY'],
  [DayOfWeek.WEDNESDAY, 'WEDNESDAY'],
  [DayOfWeek.THURSDAY, 'THURSDAY'],
  [DayOfWeek.FRIDAY, 'FRIDAY'],
  [DayOfWeek.SATURDAY, 'SATURDAY'],
  [DayOfWeek.SUNDAY, 'SUNDAY'],
]);
