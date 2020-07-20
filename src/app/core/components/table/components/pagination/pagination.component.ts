import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/table/pagination/pagination.model';

@Component({
  selector: 'core-table-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pagination:PaginationModel;
  @Input() visiblePages:number;
  @Input() lastPage:number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  public currentPage:number;
  public pages:Array<number>;
  public showPagination:boolean;

  constructor() { 
  }

  ngOnInit(): void { 
    this.showPagination = true;
  }
  
  ngOnChanges(){
    if(this.pagination){
      this.currentPage = this.pagination.initPage;
      this.visiblePages = this.pagination.visiblePages;
      this.lastPage = Math.ceil(this.pagination.lastPage);
      this.calculateLimits();
    }
  }

  public calculateLimits():void {
    let possibleLowerLimit = this.currentPage - this.visiblePages;
    if(possibleLowerLimit < 1){
      possibleLowerLimit = 1;
    }
    let possibleUpperLimit = this.currentPage + this.visiblePages;
    if(possibleUpperLimit > this.lastPage){
      possibleUpperLimit = this.lastPage;
    }
    this.pages = this.generateRange(possibleLowerLimit, possibleUpperLimit);
    if(this.pages.length >= 2){
      this.showPagination = true;
    } else{
      this.showPagination = false;
    }
  }

  public changePagination(selectedPage:number):void{
    this.currentPage = selectedPage;
    this.changePage.emit(selectedPage);
  }

  public changePaginationWithIncrement(increment:number):void{
    let temporalCurrentPage = this.currentPage + (increment);
    if(temporalCurrentPage < 1){
      temporalCurrentPage = 1;
    } else if(temporalCurrentPage > this.lastPage){
      temporalCurrentPage = this.lastPage;
    }
    this.currentPage = temporalCurrentPage;
    this.changePage.emit(this.currentPage);
    this.calculateLimits();
  }

  private generateRange(lowerLimit:number, upperLimit:number){
    let result:Array<number> = new Array<number>();
    for(let x=lowerLimit;x<=upperLimit;x++){
      result.push(x);
    }
    return result;
  }
}
