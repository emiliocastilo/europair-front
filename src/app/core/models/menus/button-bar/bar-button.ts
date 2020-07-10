export interface BarButton {
  type: BarButtonType;
  text: string;
  icon?: string;
}

export enum BarButtonType {
  NEW = 'new',
  DELETE = 'delete',
}
