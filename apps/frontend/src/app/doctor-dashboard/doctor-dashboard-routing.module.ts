import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { DoctorExamListComponent } from './exam-list/exam-list.component';


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
        path: 'doctor',
        component: DoctorDashboardComponent,
        canActivate: [ AuthGuard ],
        data: { roles: [ Role.doctor ] }
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DoctorDashboardRoutingModule {}