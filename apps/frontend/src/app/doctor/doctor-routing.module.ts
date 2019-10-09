import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { AuthGuard } from '../_guards';
import { Role } from '../_models';
import { DoctorCreateComponent } from './doctor-create/doctor-create.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin, Role.admin, Role.user] }
  },
  {
    path: 'doctorcreate',
    component: DoctorCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin, Role.admin, Role.user]  }
  },
  {
    path: 'doctoredit/:doctorId',
    component: DoctorCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.sadmin, Role.admin, Role.user]  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule {}
