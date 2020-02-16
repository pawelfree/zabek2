import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterListComponent } from './register-list/register-list.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { DoctorRegisterResolver } from './doctor-register/doctor-register.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: RegisterListComponent,
  },
  {
    path: 'register/:id',
    resolve: { data: DoctorRegisterResolver },
    component: DoctorRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRegisterRoutingModule {}
