import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/login/auth.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { AngularMaterialModule } from './angular-material.module';
import { ErrorComponent, InfoComponent, ChangePasswordComponent } from './common-dialogs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { DoctorRegisterComponent } from './auth/doctor-register/doctor-register.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [ 
    AppComponent, 
    HeaderComponent,
    SideNavComponent,
    AuthComponent,
    DoctorRegisterComponent,
    ErrorComponent,
    ChangePasswordComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "zabek"}), 
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects]),
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    ChangePasswordComponent,
    InfoComponent
  ]
})
export class AppModule {}
