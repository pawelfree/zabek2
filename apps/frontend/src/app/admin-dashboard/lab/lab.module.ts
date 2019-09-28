import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabRoutingModule } from './lab-routing.module';
import { LabEditResolver } from './lab-create/lab-create.resolver';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    LabRoutingModule
  ],
  declarations: [
    LabListComponent,
    LabCreateComponent
  ],
  providers: [
    LabEditResolver
  ]
})
export class LabModule {}