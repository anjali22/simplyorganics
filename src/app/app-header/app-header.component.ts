import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app-header.component.css', 
              '../../assets/css/ecommerce/style.css'
  ]
})
export class AppHeaderComponent implements OnInit {

  constructor( private auth: AuthenticationService) { }

  ngOnInit() {
  }
  logout() {
    this.auth.logout();
  }
}
