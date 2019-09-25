import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectLabComponent } from './select-lab/select-lab.component';
import { LabModule } from './lab/lab.module';
import { UserModule } from './user/user.module';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    LabModule,
    UserModule
  ],
  declarations: [
    ReportsComponent,
    SelectLabComponent
  ],
  entryComponents: [
    SelectLabComponent
  ]
})
export class AdminDashboardModule {}
