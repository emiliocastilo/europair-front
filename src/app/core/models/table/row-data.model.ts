import { ColumnDataModel } from './colum-data.model';

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
}