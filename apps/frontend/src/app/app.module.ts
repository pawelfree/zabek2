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
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { AngularMaterialModule } from './angular-material.module';
import { ErrorComponent, InfoComponent, ChangePasswordComponent } from './common-dialogs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { DoctorRegisterComponent } from './auth/doctor-register/doctor-register.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ResetPasswordComponent } from './auth/reset-password/resetpassword.component';
import { ConfirmationComponent } from './common-dialogs/confirmation/confirmation.component';
import { AcceptRulesComponent } from './common-dialogs/accept-rules/accept-rules.component';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FilesComponent } from './files/files.component';
import { LoadingComponent } from './loading/loading.component';
import { MessagesComponent } from './mesaages/messages.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
 
registerLocaleData(localePl, 'pl');

@NgModule({
  declarations: [ 
    AppComponent, 
    HeaderComponent,
    AuthComponent,
    DoctorRegisterComponent,
    ResetPasswordComponent,
    ErrorComponent,
    ChangePasswordComponent,
    InfoComponent,
    ConfirmationComponent,
    AcceptRulesComponent,
    FilesComponent,
    LoadingComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    StoreModule.forRoot(appReducer, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),
    EffectsModule.forRoot([AuthEffects]),
    FlexLayoutModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    ChangePasswordComponent,
    InfoComponent,
    ConfirmationComponent,
    AcceptRulesComponent
  ]
})
export class AppModule {

}
