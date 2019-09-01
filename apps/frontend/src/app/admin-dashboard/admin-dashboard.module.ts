import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectLabComponent } from './select-lab/select-lab.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    AdminDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ReportsComponent,
    UserListComponent,
    UserCreateComponent,
    LabListComponent,
    LabCreateComponent,
    SelectLabComponent
  ],
  entryComponents: [
    SelectLabComponent
  ]
})
export class AdminDashboardModule {}
