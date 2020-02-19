import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { SearchSelectComponent } from './search-select/search-select.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ScrollTestComponent } from './scrolltest.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    component: ScrollTestComponent,
  }
];

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    VirtualScrollComponent,
    SearchSelectComponent,
    ScrollTestComponent,
    AutocompleteComponent
  ]
})
export class ScrollTestingModule {}

