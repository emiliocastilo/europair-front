import { Role } from '../../roles/models/role';
import { Task } from '../../tasks/models/task';

export interface User {
  id: number;
  username: string;
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
  name: '',
  surname: '',
  email: '',
  timeZone: '',
  roles: [],
  tasks: [],
};
