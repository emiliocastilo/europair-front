export interface BaseAudit {
  user: string;
  datetime: Date;
  revType: RevType;
  changes?: AuditChanges[];
}

export interface AuditChanges {
  propertyName: string;
  oldValue?: string;
  newValue?: string;

}

export enum RevType {
  ADD,
  UPDATE,
  DELETE
}
