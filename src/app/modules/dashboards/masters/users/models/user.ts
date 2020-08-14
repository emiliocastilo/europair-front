import { Role } from '../../roles/models/role';
import { Task } from '../../tasks/models/task';
import { Audit } from 'src/app/core/models/audit/audit';

export interface User extends Audit {
  id: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  timeZone: string;
  roles: Role[];
  tasks: Task[];
}

export const EMPTY_USER: User = {
  id: null,
  username: '',
  password: '',
  name: '',
  surname: '',
  email: '',
  timeZone: '',
  roles: [],
  tasks: [],
};
