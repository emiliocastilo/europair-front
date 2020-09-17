export interface FileRoute {
  id: number;
  code: string;
  frequency: FrequencyType;
  initialDate: Date;
  endDate: Date;
  rotations: FileRoute[];
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
