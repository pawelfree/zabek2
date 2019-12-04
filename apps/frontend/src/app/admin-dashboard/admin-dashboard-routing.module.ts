import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { ReportsComponent } from './reports/reports.component';
import { FeedbackListComponent } from './feedback/feedback-list/feedback-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: "user",
    loadChildren: './user/user.module#UserModule'
  },
  {   
    path: "lab", 
    loadChildren: './lab/lab.module#LabModule'
  },
  {   
    path: "feedbacks", 
    component: FeedbackListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.sadmin] }
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
