import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './_models';
import { AuthGuard } from './_guards';
import { DoctorComponent } from './doctor/doctor.component';

const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'user',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.user]}
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.admin] }
    },
    {
        path: 'doctor',
        component: DoctorComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.doctor] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: ''
    }

];


export const routing = RouterModule.forRoot(appRoutes); 