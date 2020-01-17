import { Component, Renderer2, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../common-dialogs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { map, switchMapTo } from 'rxjs/operators';
import { AuthActions } from '../auth/store/auth.action-types';
import { ModulesList } from './header-list';
import { currentUser } from '../auth/store/auth.selectors';

@Component({
  selector: 'zabek-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User>;

  @Output() public sidenavToggle = new EventEmitter();
  
//------
menuList: Array<any>;
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
    this.currentUser$ = this.store.pipe(select(currentUser));
    this.menuList = ModulesList;
  }

  menuenter() {
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
  
  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger !== trigger){
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

  authorized(role: string, roles: string[]) {
    return roles.indexOf(role) !== -1;
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
