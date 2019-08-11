import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExaminationModule } from './examination/examination.module';


@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule,
        ExaminationModule
    ],
    declarations: [
        UserDashboardComponent,
    ]
})
export class UserDashboardModule {}