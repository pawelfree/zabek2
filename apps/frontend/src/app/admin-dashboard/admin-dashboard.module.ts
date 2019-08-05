import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        AdminDashboardRoutingModule
    ],
    declarations: [
        AdminDashboardComponent,
        ReportsComponent,
        UserListComponent,
        UserCreateComponent
    ]
})
export class AdminDashboardModule {}