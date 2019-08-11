import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficeCreateComponent } from './office-create/office-create.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, AdminDashboardRoutingModule],
  declarations: [
    ReportsComponent,
    UserListComponent,
    UserCreateComponent,
    OfficeListComponent,
    OfficeCreateComponent
  ]
})
export class AdminDashboardModule {}
