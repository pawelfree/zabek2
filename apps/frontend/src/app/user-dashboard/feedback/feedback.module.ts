import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    FeedbackRoutingModule
  ],
  declarations: [
    FeedbackListComponent,    
  ]
})
export class FeedbackModule {}