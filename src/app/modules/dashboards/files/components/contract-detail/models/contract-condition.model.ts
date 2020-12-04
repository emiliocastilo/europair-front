import { Contract } from '../../../models/Contract.model';

export interface ContractCondition {
    id?: number;
    contractId?: number;
    contract?: Contract;
    conditionOrder?: number;
    code?: string;
    title?: string;
    description?: string;
}