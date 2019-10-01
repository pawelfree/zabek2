import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    UserRoutingModule,
  ],
  declarations: [
    UserListComponent,
    UserCreateComponent
  ]
})
export class UserModule {}