import { Task } from '../../tasks/models/task';

export interface Role {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

export const EMPTY_ROLE: Role = {
  id: null,
  name: '',
  description: '',
  tasks: [],
};
