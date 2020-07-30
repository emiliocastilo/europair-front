import { Task } from '../../tasks/models/task';
import { Audit } from '../../../../../core/models/audit/audit';

export interface Role extends Audit {
  id: number;
  name: string;
  description: string;
  tasks: Task[]
}

export const EMPTY_ROLE: Role = {
  id: null,
  name: '',
  description: '',
  tasks: [],
  createdAt: null,
  createdBy : null,
  modifiedAt : null,
  modifiedBy : null
};
