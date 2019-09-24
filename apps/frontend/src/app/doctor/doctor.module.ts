import { NgModule } from '@angular/core';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    DoctorRoutingModule,
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    DoctorListComponent
  ]
})
export class DoctorModule {}