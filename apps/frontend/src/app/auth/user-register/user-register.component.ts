import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../_validators';
import { Observable, Subscription } from 'rxjs';
import { tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'zabek-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit, OnDestroy { 
  form: FormGroup;
  regulationsAccepted$: Observable<boolean>;
  sameAddresses$: Observable<boolean>;
  private officeAddressSubs: Subscription;
  private regulationsAcceptedSubs: Subscription;

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),    
      qualificationsNo: new FormControl(null, {
        validators: [ Validators.required]
      }),  
      officeName: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),   
      officeAddres: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(true), 
      officeCorrespondenceAddres: new FormControl(null),
      examFormat: new FormControl("tiff", {
        validators: [ Validators.required]
      }),    
      tomographyWithViewer: new FormControl(false),    
      password1: new FormControl(null, {
        validators: [ Validators.required, 
                      Validators.minLength(8),
                      CustomValidator.patternMatch(/\d/, {hasNumber: true}),
                      CustomValidator.patternMatch(/[A-Z]/, {hasCapitalCase: true}),
                      CustomValidator.patternMatch(/[a-z]/, {hasSmallCase: true}),
                      CustomValidator.patternMatch(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {hasSpecialCharacters: true})
                    ]
      }),
      password2: new FormControl(null, {
        validators: [Validators.required]
      }),
      regulationsAccepted: new FormControl(false),  
      },
      {
          validators: CustomValidator.mustMatch('password1', 'password2')
      });

      this.regulationsAcceptedSubs = this.form.controls.regulationsAccepted.valueChanges.pipe(
        startWith(false),
        tap(value => this.regulationsAccepted$ = value)
      ).subscribe();

      this.officeAddressSubs = this.form.controls.sameAddresses.valueChanges.pipe(
        startWith(true),
        tap(value => {
          if (!value) {
            this.form.controls.officeCorrespondenceAddres.setValidators(
              [ Validators.required,
                Validators.minLength(5)]);
          } else {
            this.form.controls.officeCorrespondenceAddres.clearValidators();
          }
          this.form.controls.officeCorrespondenceAddres.updateValueAndValidity({ onlySelf: true, emitEvent: false});
          this.sameAddresses$ = value;
        })
      ).subscribe();
  }

  ngOnDestroy() {
    if (this.officeAddressSubs) {
      this.officeAddressSubs.unsubscribe();
    }
    this.officeAddressSubs = null;

    if (this.regulationsAcceptedSubs) {
      this.regulationsAcceptedSubs.unsubscribe();
    }
    this.regulationsAcceptedSubs = null;
  }

  onSubmit() {
    console.log(this.form);
  }
  
  showRegulations() {
    console.log(this.form)
  }

}