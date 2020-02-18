import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/login/auth.component';
import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './auth/reset-password/resetpassword.component';
import { ResetPasswordResolver } from './auth/reset-password/resetpassword.resolver';
import { RulesGuard, AuthGuard } from './_guards';
import { FilesComponent } from './files/files.component';
import { Role } from '@zabek/data';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'user',
        loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule)
    },
    {
        path: 'doctor',
        canActivate: [RulesGuard],
        loadChildren: () => import('./doctor-dashboard/doctor-dashboard.module').then(m => m.DoctorDashboardModule)
    },
    {
        path: 'login',
        component: AuthComponent
    },
    {
        path: 'register',
        loadChildren: () => import('./register/register.module').then(m => m.DoctorRegisterModule)
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
        data: { roles: [Role.sadmin] },
        component: FilesComponent
    },
    {
        path: 'virtual',
        component: VirtualScrollComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}