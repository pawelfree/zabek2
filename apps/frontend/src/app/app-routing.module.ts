import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './_models';
import { AuthGuard } from './_guards';
import { DoctorComponent } from './doctor/doctor.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
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
        data: { roles: [Role.admin] },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: UserListComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            }
        ]
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
        redirectTo: 'login'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]

})
export class AppRoutingModule {}