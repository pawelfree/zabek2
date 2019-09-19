import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        UserDashboardComponent,
        ExamListComponent,
        ExamCreateComponent
    ]
})
export class UserDashboardModule {}