import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/login/auth.component';
import { DoctorRegisterComponent } from './auth/doctor-register/doctor-register.component';
import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './auth/reset-password/resetpassword.component';
import { ResetPasswordResolver } from './auth/reset-password/resetpassword.resolver';
import { RulesGuard, AuthGuard } from './_guards';
import { FilesComponent } from './files/files.component';
import { Role } from '@zabek/data';

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
        path: 'doctor',
        canActivate: [RulesGuard],
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
        path: 'resetpassword/:id',
        resolve: {token: ResetPasswordResolver},
        component: ResetPasswordComponent
    },
    {
        path: 'resetpassword',
        component: ResetPasswordComponent
    },
    {
        path: "files",
        canActivate: [AuthGuard],
        data: { roles: [Role.user] },
        component: FilesComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    },


];

@NgModule({
//    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}