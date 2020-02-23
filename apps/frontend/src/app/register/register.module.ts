import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterListComponent } from './register-list/register-list.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { DoctorRegisterRoutingModule } from './register-routing.module';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    DoctorRegisterRoutingModule
  ],
  declarations: [
    RegisterListComponent,
    DoctorRegisterComponent,
    DoctorEditComponent
  ]
})
export class DoctorRegisterModule {}

