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

export const MEASURES_ABBREVIATIONS = {
  [MeasureType.KILOMETER]: 'km',
  [MeasureType.METER]: 'm',
  [MeasureType.NAUTIC_MILE]: 'nm',
  [MeasureType.FOOT]: 'ft',
  [MeasureType.INCH]: 'in',
};

export const MEASURE_LIST = [
  MeasureType.KILOMETER,
  MeasureType.METER,
  MeasureType.NAUTIC_MILE,
  MeasureType.FOOT,
  MeasureType.INCH,
] as const;
