import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { DoctorDashboardRoutingModule } from './doctor-dashboard-routing.module';
import { DoctorExamListComponent } from './exam-list/exam-list.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        DoctorDashboardRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        DoctorExamListComponent,
        FeedbackComponent
    ]
})
export class DoctorDashboardModule {}