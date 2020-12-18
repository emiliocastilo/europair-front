import { Audit } from 'src/app/core/models/audit/audit';

export interface ContractPaymentCondition extends Audit {
  id: number;
  code: string;
  name: string;
}
