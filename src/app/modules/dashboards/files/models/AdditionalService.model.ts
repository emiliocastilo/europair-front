import { FileStatus, Provider } from './File.model';

export interface AdditionalService {
    id?: number;
    code?: string;
    serviceId?: number;
    flightIdList?: Array<number>;
    flightId?: number;
    description?: string;
    quantity?: number;
    provider?: Provider;
    providerId?: number;
    purchasePrice?: number;
    salePrice?: number;
    tax?: number;
    commision?: number;
    comment?: string;
    seller?: string;
    status?: FileStatus;
}