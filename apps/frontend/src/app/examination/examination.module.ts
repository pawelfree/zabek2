import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddExaminationComponent } from './add/add-examination.component';
import { EditExaminationComponent } from './edit/edit-examination.component';
import { DeleteExaminationComponent } from './delete/delete-examination.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AddExaminationComponent,
        EditExaminationComponent,
        DeleteExaminationComponent,        
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModule
    ],
    entryComponents: [
        AddExaminationComponent,
        EditExaminationComponent,
        DeleteExaminationComponent,  
    ]
})
export class ExaminationModule {}