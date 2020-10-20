export class MenuModel {
    constructor(
        public id:number,
        public name:string,
        public label:string,
        public icon:string,
        public route:string,
        public childs:Array<MenuModel>
    ) { }
}