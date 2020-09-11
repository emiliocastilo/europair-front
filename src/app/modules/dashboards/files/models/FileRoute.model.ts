export interface FileRoute {
  id: number;
  code: string;
  frequency: string;
  initialDate: string;
  endDate: string;
  rotations: FileRoute[];
}
