import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectInfiniteScrollModule } from '../_directives/select-infinite-scroll/selectinfinitescroll.module';
import { MatDialogModule } from "@angular/material";
import { DoctorCreateDlgComponent } from './doctor-create-dlg/doctor-create-dlg.component';


@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        UserDashboardRoutingModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatSelectInfiniteScrollModule,
        MatDialogModule
    ],
    declarations: [
        ExamListComponent,
        ExamCreateComponent,
        DoctorCreateDlgComponent
    ],
    entryComponents: [DoctorCreateDlgComponent]
})
export class UserDashboardModule {}