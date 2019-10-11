import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { DoctorDashboardRoutingModule } from './doctor-dashboard-routing.module';
import { DoctorExamListComponent } from './exam-list/exam-list.component';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        DoctorDashboardRoutingModule
    ],
    declarations: [
        DoctorExamListComponent
    ]
})
export class DoctorDashboardModule {}