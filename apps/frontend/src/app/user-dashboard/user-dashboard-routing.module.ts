import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { Role } from '@zabek/data';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'doctor',
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
    path: "doctor",
    loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule), 
  },
  {
    path: "exam",
    loadChildren: () => import('./exam/exam.module').then(m => m.ExamModule), 
  },
  {   
    path: "feedbacks", 
    loadChildren: './feedback/feedback.module#FeedbackModule'
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
export class UserDashboardRoutingModule {}
