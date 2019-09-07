import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscription: Subscription;
  @Output() sidenavClose = new EventEmitter();
 
  constructor(private readonly authService: AuthenticationService) { }
 
  ngOnInit() {
    this.subscription = this.authService.user.subscribe(user => {
      this.currentUser = user;
    });
  }
 
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  get isAdmin() {
    return this.currentUser && (this.currentUser.role === Role.admin || this.currentUser.role === Role.sadmin);
  }

  get isSAdmin() {
    return this.currentUser && this.currentUser.role === Role.sadmin;
  }
 
}