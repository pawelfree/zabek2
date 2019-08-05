import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { ReportsComponent } from './reports/reports.component';


const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'userlist',
      pathMatch: 'full'
    },
    {
        path: 'userlist',
        component: UserListComponent,
        canActivate: [ AuthGuard ],
        data: { roles: [ Role.admin ] }
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [ AuthGuard ],
        data: { roles: [ Role.admin ]}
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}
