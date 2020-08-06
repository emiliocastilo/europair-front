export interface BarButton {
  type: BarButtonType;
  text: string;
  icon?: string;
}

export enum BarButtonType {
  NEW = 'new',
  DELETE = 'delete',
  DELETE_SELECTED = 'delete_selected',
  SEARCH = 'search',
  CHECK = 'check',
  EDIT = 'edit',
  VIEW = 'view',
}
