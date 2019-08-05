import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { DoctorDashboardComponent } from './doctor-dashboard.component';


const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'doctor',
      pathMatch: 'full'
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