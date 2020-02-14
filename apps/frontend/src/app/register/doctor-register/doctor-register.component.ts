import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator, PeselValidator, NIPValidator, UserEmailValidator, UserPwzValidator } from '../../_validators';
import { Observable } from 'rxjs';
import { tap, startWith, take, finalize } from 'rxjs/operators';
import { User, Role, Doctor } from '@zabek/data';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../_services'
import { PwzValidator } from '../../_validators';
import { Store } from '@ngrx/store';
import { AppState, AppActions } from '../../store';


@Component({
  selector: 'zabek-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent implements OnInit { 
  form: FormGroup;
  regulationsAccepted$: Observable<boolean>;
  sameAddresses$: Observable<any>;
  private lab_id: null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly store: Store<AppState>,
    private readonly userEmailValidator: UserEmailValidator,
    private readonly userPwzValidator: UserPwzValidator
  ){}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [ Validators.required, Validators.email],
        asyncValidators: [this.userEmailValidator.validate.bind(this.userEmailValidator)],
        updateOn: 'blur'
      }),
      firstName: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(25)]
      }),
      lastName: new FormControl(null, {
        validators: [ Validators.required,
                      Validators.minLength(5),
                      Validators.maxLength(25)]
      }),    
      qualificationsNo: new FormControl(null, {
        validators: [ Validators.required, 
                      Validators.minLength(7), 
                      Validators.maxLength(7), 
                      CustomValidator.patternMatch(/^[0-9]{7}$/, {onlyNumbers : true}) ],
        asyncValidators: [ this.userPwzValidator.validate.bind(this.userPwzValidator)],
        updateOn: 'blur'
      }),  
      pesel: new FormControl(null, {
        validators: [  
          Validators.minLength(11), 
          Validators.maxLength(11), 
          CustomValidator.patternMatch(/^[0-9]{11}$/, {onlyNumbers : true}),
          PeselValidator.validPesel ]

      }),
      nip: new FormControl(null, {
        validators: [         
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidator.patternMatch(/^[0-9]{10}$/, { onlyNumbers: true }),
          NIPValidator.validNIP
        ]
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
      examFormat: new FormControl("jpeg", {
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

      this.route.params.pipe(
        take(1),
        tap(parms => this.lab_id = parms['id'])
      ).subscribe();

      this.regulationsAccepted$ = this.form.controls.regulationsAccepted.valueChanges.pipe(
        startWith(false)
      );

      this.sameAddresses$ = this.form.controls.sameAddresses.valueChanges.pipe(
        startWith(true),
        tap(value => {
          if (!value) {
            this.form.controls.officeCorrespondenceAddress.setValidators([
              Validators.required,
              Validators.minLength(5)
            ]);
          } else {
            this.form.controls.officeCorrespondenceAddress.clearValidators();
          }
          this.form.controls.officeCorrespondenceAddress.updateValueAndValidity(
            { onlySelf: true, emitEvent: false }
          );
        })
      );
  }

  onSubmit() {
    if (this.form.invalid)  {
      return;
    }
    if (!this.lab_id) {
      this.store.dispatch(AppActions.sendInfo({info: 'Niepoprawny (brak) identyfikator pracowni' }));
      return;
    }
    const checkForLabId = new RegExp("^[0-9a-fA-F]{24}$")
    if (!checkForLabId.test(this.lab_id)) {
      this.store.dispatch(AppActions.sendInfo({info: 'Niepoprawny identyfikator pracowni' }));
      return;
    }

    this.store.dispatch(AppActions.loadingStart());
    const newDoctor: Doctor = {
      _id: null,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      pesel: this.form.value.pesel,
      nip: this.form.value.nip,
      qualificationsNo: this.form.value.qualificationsNo,
      officeName: this.form.value.officeName,
      officeAddress: this.form.value.officeAddress,
      officeCorrespondenceAddress: this.form.value.sameAddresses
      ? this.form.value.officeAddress
      : this.form.value.officeCorrespondenceAddress,
      examFormat: this.form.value.examFormat,
      tomographyWithViewer: this.form.value.tomographyWithViewer,
      email: this.form.value.email
    }
    const newUser: User = Object.assign(new User(),{ 
      _id: null,
      email: this.form.value.email,
      role: Role.doctor,
      rulesAccepted: true,
      active: false,
      lab: this.lab_id,
      doctor: newDoctor,
      password: this.form.value.password1
    });

    this.doctorService.registerDoctor(newUser).pipe(
      take(1),
      finalize(() => this.store.dispatch(AppActions.loadingEnd()))
    ).subscribe(
      res => this.goOut(),
      err => {
        this.store.dispatch(AppActions.raiseError({message: err, status: null}));
      }
    );
  }
  
  private goOut() {
    this.store.dispatch(AppActions.sendInfo({info: 'Rejestracja zakończona pomyślnie. Na podany email zostanie wysłana informacja o aktywacji konta.'}))
    this.router.navigate(['/login']);
  }

  showRegulations() {
    window.open('regulations.html', "_blank");
  }

}