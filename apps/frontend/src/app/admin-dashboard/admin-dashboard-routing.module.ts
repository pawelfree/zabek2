import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { ReportsComponent } from './reports/reports.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficeCreateComponent } from './office-create/office-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'userlist',
    pathMatch: 'full'
  },
  {
    path: 'userlist',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.sadmin] }
  },
  {
    path: 'usercreate',
    component: UserCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.sadmin] }
  },
  {
    path: 'useredit/:userId',
    component: UserCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.sadmin] }
  },
  {
    path: 'officelist',
    component: OfficeListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin] }
  },
  {
    path: 'officecreate',
    component: OfficeCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin] }
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.sadmin] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}
