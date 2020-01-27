import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { AuthGuard } from '../_guards';
import { Role } from '@zabek/data';
import { DoctorCreateComponent } from './doctor-create/doctor-create.component';
import { DoctorListResolver } from './doctor-list/doctor-list.resolver';
import { DoctorEditResolver } from './doctor-create/doctor-edit.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: DoctorListComponent,
    resolve: { doctors: DoctorListResolver },
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin, Role.admin, Role.user] }
  },
  {
    path: 'create',
    component: DoctorCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.user]  }
  },
  {
    path: 'edit/:doctorId',
    component: DoctorCreateComponent,
    resolve: {doctor: DoctorEditResolver },
    canActivate: [AuthGuard],
    data: { roles: [Role.admin, Role.user]  }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule {}
