import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectLabComponent } from './select-lab/select-lab.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    UserDashboardRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [
    ReportsComponent,
    SelectLabComponent,
  ],
  entryComponents: [
    SelectLabComponent,
  ]
})
export class UserDashboardModule {}

