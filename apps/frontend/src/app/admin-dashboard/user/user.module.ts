import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './store/user.reducer';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    UserRoutingModule,
    EffectsModule.forFeature([UserEffects]),
    StoreModule.forFeature('user', userReducer)
  ],
  declarations: [
    UserListComponent,
    UserCreateComponent
  ]
})
export class UserModule {}