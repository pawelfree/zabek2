import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '@zabek/data';
import { DoctorExamListComponent } from './exam-list/exam-list.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ExaminationListResolver } from './exam-list/exam-list.resolver';


const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'exam/list',
      pathMatch: 'full'
    },
    {
      path: 'exam/list',
      component: DoctorExamListComponent,
      resolve: { examinations: ExaminationListResolver },
      canActivate: [ AuthGuard ],
      data: { roles: [ Role.doctor ] }
    },
    {
      path: 'feedback',
      component: FeedbackComponent,
      canActivate: [ AuthGuard ],
      data: { roles: [ Role.doctor ] }
    },  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DoctorDashboardRoutingModule {}