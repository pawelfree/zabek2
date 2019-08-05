import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'user',
        loadChildren: './user-dashboard/user-dashboard.module#UserDashboardModule'
    },
    {   
        path: "admin", 
        loadChildren: './admin-dashboard/admin-dashboard.module#AdminDashboardModule'
    },
    {
        path: 'doctor',
        loadChildren: './doctor-dashboard/doctor-dashboard.module#DoctorDashboardModule'
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
    exports: [RouterModule]
})
export class AppRoutingModule {}