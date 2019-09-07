import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services';

@Component({
  selector: 'zabek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private readonly authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }
}