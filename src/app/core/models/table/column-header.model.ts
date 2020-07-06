import { ColumnHeaderSizeModel } from './colum-header-size.model';

export class ColumnHeaderModel {
    constructor(
        public identifier: string,
        public type:string,
        public label:string,
        public size:ColumnHeaderSizeModel
    ) { }
}