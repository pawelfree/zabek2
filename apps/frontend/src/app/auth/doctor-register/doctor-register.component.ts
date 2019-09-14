import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../_validators';
import { Observable, Subscription } from 'rxjs';
import { tap, startWith } from 'rxjs/operators';
import { Doctor } from '../../_models';
import { Router } from '@angular/router';
import { DoctorService } from '../../_services'

@Component({
  selector: 'zabek-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent implements OnInit, OnDestroy { 
  form: FormGroup;
  regulationsAccepted$: Observable<boolean>;
  sameAddresses$: Observable<boolean>;
  private officeAddressSubs: Subscription;
  private regulationsAcceptedSubs: Subscription;
  isLoading: boolean;


  constructor(
    private readonly router: Router,
    private readonly doctorService: DoctorService
  ){}

  ngOnInit() {
    this.isLoading = false;
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [ Validators.required, 
                      Validators.email]
      }),
      firstName: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
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
      officeAddress: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(true), 
      officeCorrespondenceAddress: new FormControl(null),
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
            this.form.controls.officeCorrespondenceAddress.setValidators(
              [ Validators.required,
                Validators.minLength(5)]);
          } else {
            this.form.controls.officeCorrespondenceAddress.clearValidators();
          }
          this.form.controls.officeCorrespondenceAddress.updateValueAndValidity({ onlySelf: true, emitEvent: false});
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
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      const doctor = new Doctor(
        "",
        this.form.value.email,
        this.form.value.password1,
        null,null,null,
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.officeName,
        this.form.value.officeAddress,
        this.form.value.qualificationsNo,
        this.form.value.sameAddresses ? this.form.value.officeAddress : this.form.value.officeCorrespondenceAddress,
        this.form.value.examFormat,
        this.form.value.tomographyWithViewer,
        false);

      this.doctorService.addDoctor(doctor).subscribe(res => this.goOut());

      this.isLoading = false;
  }
  
  private goOut() {
    this.router.navigate(['/login']);
  }

  showRegulations() {
    console.log(this.form)
  }

}