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
  SAVE = 'save',
  CHECK = 'check',
  EDIT = 'edit',
  VIEW = 'view',
}
