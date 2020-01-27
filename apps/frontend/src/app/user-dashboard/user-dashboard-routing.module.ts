import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '@zabek/data';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ExaminationListResolver } from './exam-list/exam-list.resolver';
import { ExamEditResolver } from './exam-create/exam-create.resolver';

const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'examinations',
      pathMatch: 'full'
    },
    {
        path: 'examinations',
        component: ExamListComponent,
        resolve: { examinations : ExaminationListResolver },
        canActivate: [ AuthGuard ],
        data: { roles: [ Role.admin, Role.user ] }
    },
    {
      path: 'examcreate',
      component: ExamCreateComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.admin, Role.user] }
    },
    {
      path: 'examedit/:examId',
      component: ExamCreateComponent,
      resolve: { examination: ExamEditResolver },
      canActivate: [AuthGuard],
      data: { roles: [Role.admin, Role.user] }
    }   
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule {}
