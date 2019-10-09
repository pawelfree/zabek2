import { NgModule } from '@angular/core';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DoctorCreateComponent } from './doctor-create/doctor-create.component';

@NgModule({
  imports: [
    DoctorRoutingModule,
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    DoctorListComponent,
    DoctorCreateComponent
  ]
})
export class DoctorModule {}