import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExaminationListComponent } from './examination/examination-list/examination-list.component';
import { ExaminationCreateComponent } from './examination/examination-create/examination-create.component';


@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule
    ],
    declarations: [
        ExaminationListComponent,
        ExaminationCreateComponent,
        UserDashboardComponent,
    ]
})
export class UserDashboardModule {}