import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { DoctorExamListComponent } from './exam-list/exam-list.component';
import { FeedbackComponent } from './feedback/feedback.component';


const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'examinations',
      pathMatch: 'full'
    },
    {
      path: 'examinations',
      component: DoctorExamListComponent,
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