import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { DoctorDashboardRoutingModule } from './doctor-dashboard-routing.module';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        DoctorDashboardRoutingModule
    ],
    declarations: [
        DoctorDashboardComponent,
    ]
})
export class DoctorDashboardModule {}