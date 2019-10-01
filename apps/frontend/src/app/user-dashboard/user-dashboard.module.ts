import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule,
        ReactiveFormsModule,
        MatDatepickerModule
    ],
    declarations: [
        ExamListComponent,
        ExamCreateComponent
    ]
})
export class UserDashboardModule {}