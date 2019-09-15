import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExamListComponent } from './exam-list/exam-list.component';



@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule
    ],
    declarations: [
        UserDashboardComponent,
        ExamListComponent
    ]
})
export class UserDashboardModule {}