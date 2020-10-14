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
    PENDING = 'PENDING',
    SENDED = 'SENDED',
    QUOTED = 'QUOTED',
    WON = 'WON'
}
