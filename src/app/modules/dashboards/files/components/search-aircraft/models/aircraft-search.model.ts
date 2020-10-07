export interface AircraftSearchResult {
    aircraftCategoryCode: string;
    aircraftCategoryId: number;
    aircraftId: number;
    aircraftSubcategoryCode: string;
    aircraftSubcategoryId: number;
    aircraftTypeDescription: string;
    aircraftTypeId: number;
    connectionFlights: number;
    daytimeConfiguration: number;
    stretchers: number;
    insuranceEndDate: string;
    mainBaseId: number;
    mainBaseName: string;
    maxCargo: number;
    nighttimeConfiguration: number;
    observations: Array<string>;
    operatorAocLastRevisionDate: string;
    operatorId: number;
    operatorInsuranceExpirationDate: string;
    operatorName: string;
    quantity: number;
    seatingC: number;
    seatingF: number;
    seatingY: number;
    timeInHours: number;
}
