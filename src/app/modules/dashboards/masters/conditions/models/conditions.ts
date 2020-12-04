import { Audit } from 'src/app/core/models/audit/audit';
export interface Condition extends Audit {
    id?: number;
    code?: string;
    title?: string;
    conditionOrder?: number;
    description?: string;
}
