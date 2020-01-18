import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabRoutingModule } from './lab-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { LabEffects } from './store/lab.effects';
import { labReducer } from './store/lab.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    LabRoutingModule,
    EffectsModule.forFeature([LabEffects]),
    StoreModule.forFeature('lab', labReducer)
  ],
  declarations: [
    LabListComponent,
    LabCreateComponent
  ]
})
export class LabModule {}