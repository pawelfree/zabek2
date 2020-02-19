import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SearchSelectComponent } from './search-select.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SearchSelectComponent
  ],
  exports: [
    SearchSelectComponent
  ]
})
export class SearchSelectModule { }
