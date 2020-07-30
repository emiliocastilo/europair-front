export interface Measure {
    value: number;
    type: MeasureType;
}

export enum MeasureType {
    FT = 'ft',
    M = 'm',
    KM = 'km',
    NM = 'nm',
    INCH = 'inch'
}