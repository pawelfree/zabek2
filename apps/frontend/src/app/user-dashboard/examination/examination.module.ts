import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddExaminationComponent } from './add/add-examination.component';
import { EditExaminationComponent } from './edit/edit-examination.component';
import { DeleteExaminationComponent } from './delete/delete-examination.component';
import { ExaminationListComponent } from './examination-list/examination-list.component';
import { ExaminationCreateComponent } from './examination-create/examination-create.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AddExaminationComponent,
        EditExaminationComponent,
        DeleteExaminationComponent,   
        ExaminationListComponent,
        ExaminationCreateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        RouterModule
    ],
    entryComponents: [
        AddExaminationComponent,
        EditExaminationComponent,
        DeleteExaminationComponent,  
    ]
})
export class ExaminationModule {}