import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AuthComponent } from './auth/login/auth.component';
import { DoctorRegisterComponent } from './auth/doctor-register/doctor-register.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './_guards';

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
        component: AuthComponent
    },
    {
        path: 'register',
        component: DoctorRegisterComponent
    },
    {
        path: "doctorlist",
        loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule), 
    },
    {
        path: '**',
        redirectTo: 'login'
    },


];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {}