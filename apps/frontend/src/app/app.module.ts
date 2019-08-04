import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { DoctorComponent } from './doctor/doctor.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { UserCreateComponent } from './admin/user-create/user-create.component';
import { AngularMaterialModule } from './angular-material.module';
import { ErrorComponent } from './dialogs/error/error.component';
import { ExaminationModule } from './examination/examination.module';

@NgModule({
  declarations: [ 
    AdminComponent,
    AppComponent, 
    DoctorComponent,
    HeaderComponent,
    HomeComponent, 
    LoginComponent,
    ReportsComponent,
    UserCreateComponent,
    UserListComponent,
    ErrorComponent,

  ],
  imports: [ 
    BrowserModule, 
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    ExaminationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent
  ]
})
export class AppModule {}
