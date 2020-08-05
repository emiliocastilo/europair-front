import { ColumnDataModel } from './colum-data.model';
import { Audit } from '../audit/audit';

export class RowDataModel {
    constructor(
        public columns: Array<ColumnDataModel> = new Array<any>()
    ) { }

    public author: string;
    public timestamp : Date;
    public modified : boolean;

    public pushColumn(value:ColumnDataModel){
        this.columns.push(value);
    }

    public popColumn(){
        this.columns.pop();
    }

    public setAuditParams(auditData: Audit): void {
        this.author = auditData.modifiedBy != null ? auditData.modifiedBy : auditData.createdBy;
        this.timestamp = auditData.modifiedAt != null ? auditData.modifiedAt : auditData.createdAt;
        this.modified = auditData.modifiedAt != null;
    }
}