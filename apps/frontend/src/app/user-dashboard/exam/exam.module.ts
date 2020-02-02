import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamRoutingModule } from './exam-routing.module';
import { DoctorCreateDlgComponent } from './doctor-create-dlg/doctor-create-dlg.component';
import { MatSelectInfiniteScrollModule } from '../../_directives/select-infinite-scroll/selectinfinitescroll.module';
import { FileUploadComponent } from '../../files/fileupload/fileupload.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    ExamRoutingModule,
    MatSelectInfiniteScrollModule
  ],
  declarations: [
    ExamListComponent,
    ExamCreateComponent,
    DoctorCreateDlgComponent,
    FileUploadComponent
  ],
  entryComponents: [
    DoctorCreateDlgComponent,
    FileUploadComponent
  ]
})
export class ExamModule {}