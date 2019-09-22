import { NgModule } from '@angular/core';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';

@NgModule({
  imports: [
    DoctorRoutingModule
  ],
  declarations: [
    DoctorListComponent
  ]
})
export class DoctorModule {}