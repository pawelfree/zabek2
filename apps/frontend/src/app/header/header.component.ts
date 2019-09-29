import { Component, Renderer2, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../common-dialogs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import { ModulesList } from './header-list';

@Component({
  selector: 'zabek-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscription: Subscription;
  @Output() public sidenavToggle = new EventEmitter();
  
//------
modulesList: Array<any>;
enteredButton = false;
isMatMenuOpen = false;
isMatMenu2Open = false;
prevButtonTrigger;
//-----

  constructor(
    private readonly ren: Renderer2,
    private router: Router,
    private readonly store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe(user => {
      this.currentUser = user;
    });

    this.modulesList = ModulesList;
  }

  //---------

  
    menuenter() {
      console.log('menuenter')
      this.isMatMenuOpen = true;
      if (this.isMatMenu2Open) {
        this.isMatMenu2Open = false;
      }
    }
  
    menuLeave(trigger, button) {
      setTimeout(() => {
        if (!this.isMatMenu2Open && !this.enteredButton) {
          this.isMatMenuOpen = false;
          trigger.closeMenu();
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
        } else {
          this.isMatMenuOpen = false;
        }
      }, 80)
    }
  
    menu2enter() {
      this.isMatMenu2Open = true;
    }
  
    menu2Leave(trigger1, trigger2, button) {
      setTimeout(() => {
        if (this.isMatMenu2Open) {
          trigger1.closeMenu();
          this.isMatMenuOpen = false;
          this.isMatMenu2Open = false;
          this.enteredButton = false;
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
        } else {
          this.isMatMenu2Open = false;
          trigger2.closeMenu();
        }
      }, 100)
    }
  
    buttonEnter(trigger) {
      setTimeout(() => {
        if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
          this.prevButtonTrigger.closeMenu();
          this.prevButtonTrigger = trigger;
          this.isMatMenuOpen = false;
          this.isMatMenu2Open = false;
          trigger.openMenu()
        }
        else if (!this.isMatMenuOpen) {
          this.enteredButton = true;
          this.prevButtonTrigger = trigger
          trigger.openMenu()
        }
        else {
          this.enteredButton = true;
          this.prevButtonTrigger = trigger
        }
      })
    }
  
    buttonLeave(trigger, button) {
      setTimeout(() => {
        if (this.enteredButton && !this.isMatMenuOpen) {
          trigger.closeMenu();
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
        } if (!this.isMatMenuOpen) {
          trigger.closeMenu();
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
          this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
        } else {
          this.enteredButton = false;
        }
      }, 100)
    }
  
  
  //--------

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get isAdmin() {
    return this.currentUser && (this.currentUser.role === Role.admin || this.currentUser.role === Role.sadmin);
  }

  get isSAdmin() {
    return this.currentUser && this.currentUser.role === Role.sadmin;
  }
  
  get isUser() {
    return this.currentUser && !(this.currentUser.role === Role.doctor);
  }

  get isLoggedIn() {
    return this.currentUser;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['login']);
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent, {
       disableClose: true
    });
  }

  onToogleSideNav() {
    this.sidenavToggle.emit();
  }
} 
