export interface Contribution {
    id?: number;
    fileId: number;
    routeId: number;
    contributionState: ContributionStates;
    operatorId: number;
    aircraftId: number;
    quotedTime: string;
    cargoAirborne: number;
    requestTime?: string;
    comments?: string;
    purchasePrice?: number;
    purchaseCommissionPercent?: number;
    salesPrice?: number;
    salesCommissionPercent?: number;
    salesPricewithoutIVA?: boolean;
    includedIva?: boolean;
    exchangeBuyType?: { code: string, description: string };
    currency?: { code: string, description: string };
}

export enum ContributionStates {
    PENDING,
    SENDED,
    QUOTED,
    CONFIRMED
}
