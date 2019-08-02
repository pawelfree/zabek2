import { NgModule } from '@angular/core';
import {  MatToolbarModule,
    MatCardModule,
    MatInputModule, 
    MatFormFieldModule,
    MatButtonModule} from '@angular/material';

@NgModule({
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class AngularMaterialModule {}