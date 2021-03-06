import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
// import {Hero} from '../../../models/product.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { RequestOptions } from '@angular/http';
// import {Customer} from '../customer.interface';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent {


    public myForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    public events: any[] = []; // use later to display form changes

    constructor(private _fb: FormBuilder, private http: HttpClient) { } // form builder simplify form initialization
    results: object[];

    ngOnInit() {
        // the short way
      this.myForm = this._fb.group({
        first_name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
        last_name: [''] ,
    });
    }

    save(model: Customer, isValid: boolean) {

      console.log(model, isValid);
      this.submitted = true; // set form submit to true

      var body = 'fname=' + model.f_name + '&lname=' + model.l_name ;
      console.log("body-----", body);
      var bodySt = JSON.stringify(body);
      console.log("body-----", bodySt);

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
  
      this.http
        .post('http://localhost:3000/customeradd',
          body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
          })
          .subscribe(data => {
                alert('ok');
          }, error => {
              console.log(error);
          });
      }

  }
