import {Http, Response} from '@angular/http';
import {Injectable, Component, Input} from '@angular/core';
import {SalespersonColumnComponent} from './salesperson.column.component';
import {Router} from '@angular/router';

@Component({
  selector: 'salesperson-datatable',
  template: `<div class="page-content fade-in-up">
  <div class="ibox">
   <div class="ibox-body">
     <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover">
          <thead>
             <tr>
                <th *ngFor="let column of columns">{{column.header}}</th>
             </tr>
           </thead>
         <tbody *ngFor="let row of dataset">
            <tr>
                  <td *ngFor="let column of columns">{{row[column.value]}}</td>
                  <td>
                  <button (click)="details(row)" class="btn btn-default btn-sm btn-flat" data-toggle="tooltip" data-original-title="Edit"><i class="fa fa-pencil font-14"></i></button>
                  <button class="btn btn-default btn-sm btn-flat" data-toggle="tooltip" data-original-title="Delete"><i class="fa fa-trash font-14"></i></button>
                </td>
            </tr>
         </tbody>
       </table>
</div>
</div>
</div>
</div>
 `,
 
})
export class SalespersonDatatableComponent { 
 
  @Input() dataset;
  columns: SalespersonColumnComponent[] = [];
 
  constructor(private router: Router) { }

  addColumn(column) {
    this.columns.push(column);
  }

  details(value) {
    console.log('details called', value.user_id);
    this.router.navigate(['/admin/salespersondetail', value.user_id]);
  }
}
