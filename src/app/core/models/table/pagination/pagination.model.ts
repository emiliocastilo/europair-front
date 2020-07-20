export class PaginationModel {
    constructor(
        public clientPagination:boolean,
        public initPage:number,
        public visiblePages:number,
        public lastPage:number,
        public elememtsPerpage:number
    ) { }
}