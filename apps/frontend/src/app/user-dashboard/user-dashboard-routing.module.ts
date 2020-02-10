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
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {   
    path: "lab", 
    loadChildren: () => import('./lab/lab.module').then(m => m.LabModule)
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
    loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule)
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
