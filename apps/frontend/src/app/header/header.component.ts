import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscription: Subscription;

  constructor(private router: Router, private authService: AuthenticationService) {} 

  ngOnInit() {
    this.subscription = this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get isLoggedIn() {
    return this.currentUser;
  }

  isAdmin() {
    return this.isLoggedIn && this.currentUser.role === Role.admin;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
