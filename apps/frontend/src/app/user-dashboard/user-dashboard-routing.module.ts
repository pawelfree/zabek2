import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { ExaminationListComponent } from './examination/examination-list/examination-list.component';


const routes: Routes = [
    { 
      path: '', 
      redirectTo: 'examinations',
      pathMatch: 'full'
    },
    {
        path: 'examinations',
        component: ExaminationListComponent,
        canActivate: [ AuthGuard ],
        data: { roles: [ Role.user ] }
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule {}
