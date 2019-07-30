import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MatToolbarModule,
          MatCardModule,
          MatInputModule, 
          MatFormFieldModule,
          MatButtonModule} from '@angular/material';


import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { DoctorComponent } from './doctor/doctor.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { UserCreateComponent } from './admin/user-create/user-create.component';

@NgModule({
  declarations: [ AppComponent, 
                  HomeComponent, 
                  AdminComponent,
                  LoginComponent,
                  HeaderComponent,
                  DoctorComponent,
                  UserListComponent,
                  ReportsComponent,
                  UserCreateComponent
                ],
  imports: [  BrowserModule, 
              BrowserAnimationsModule,
              FormsModule,
              ReactiveFormsModule,
              HttpClientModule,
              routing,
              MatToolbarModule,
              MatCardModule,
              MatFormFieldModule,
              MatInputModule,
              MatButtonModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
