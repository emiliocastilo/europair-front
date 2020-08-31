export interface Measure {
  value: number;
  type: MeasureType;
}

export enum MeasureType {
  FOOT = 'FOOT',
  METER = 'METER',
  KILOMETER = 'KILOMETER',
  NAUTIC_MILE = 'NAUTIC_MILE',
  INCH = 'INCH',
}

export const MEASURE_LIST = [
  MeasureType.KILOMETER,
  MeasureType.METER,
  MeasureType.NAUTIC_MILE,
  MeasureType.FOOT,
  MeasureType.INCH,
] as const;
