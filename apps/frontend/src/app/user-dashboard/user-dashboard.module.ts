import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectLabComponent } from './select-lab/select-lab.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { userDashboardReducer } from './store/user-dashboard.reducer';
import { UserEffects } from './store/user.effects';
import { LabEffects } from './store/lab.effects';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    UserDashboardRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([UserEffects, LabEffects]),
    StoreModule.forFeature('user-dashboard', userDashboardReducer),
  ],
  declarations: [
    ReportsComponent,
    SelectLabComponent,
  ]
})
export class UserDashboardModule {}

