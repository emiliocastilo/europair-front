import { Screen } from './screen';

export interface Task {
  id: number;
  name: string;
  description: string;
  screens: Screen[];
}

export const EMPTY_TASK: Task = {
  id: null,
  name: '',
  description: '',
  screens: [],
};
