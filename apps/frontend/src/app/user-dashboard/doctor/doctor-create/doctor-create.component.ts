import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator, UserEmailValidator, UserPwzValidator, UserPeselValidator, UserNipValidator } from '../../../_validators';
import { Observable } from 'rxjs';
import { tap, startWith, take, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../_services';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { AppActions } from '../../../store';
import { currentUser } from '../../../auth/store';
import { User, Doctor, Lab, Role } from '@zabek/data';

@Component({
  selector: 'zabek-doctor-create',
  templateUrl: './doctor-create.component.html',
  styleUrls: ['./doctor-create.component.css']
})
export class DoctorCreateComponent implements OnInit {
  form: FormGroup;
  private mode: 'create' | 'edit';
  private lab: Lab;
  private user: User;
  private doctor: Doctor;
  private currentUser: User = null;

  sameAddresses$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit() {
  
    this.store.pipe(
      select(currentUser),
      take(1),
      tap(user => {
        this.currentUser = user;
        this.lab = user.lab;
      })
    ).subscribe();

    this.user = this.route.snapshot.data.doctor;
    this.doctor = this.user ? this.user.doctor ? this.user.doctor : null : null;

    const userEmailValidator = new UserEmailValidator(this.doctorService, this.user);
    const userPwzValidator = new UserPwzValidator(this.doctorService, this.doctor);
    const userPeselValidator = new UserPeselValidator(this.doctorService, this.doctor);
    const userNipValidator = new UserNipValidator(this.doctorService, this.doctor);

    const sameAddresses = this.doctor ? (this.doctor.officeAddress === this.doctor.officeCorrespondenceAddress ? true : false) : true;

    this.form = new FormGroup({
      email: new FormControl({value: this.user ? this.user.email : null, disabled: this.user ? true : false}, {
        validators: [Validators.required, Validators.email],
        asyncValidators: [ userEmailValidator.validate.bind(userEmailValidator) ],
        updateOn: 'blur'
      }),
      firstName: new FormControl({value: this.doctor ? this.doctor.firstName : null, disabled: false}, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      }),
      lastName: new FormControl({value: this.doctor ? this.doctor.lastName : null, disabled: false}, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      }),
      qualificationsNo: new FormControl({value: this.doctor ? this.doctor.qualificationsNo : null, disabled: this.doctor?.qualificationsNo ? true : false}, {
        validators: [ Validators.required,
                      Validators.minLength(7),
                      Validators.maxLength(7),
                      CustomValidator.patternMatch(/^[0-9]{7}$/, { onlyNumbers: true })],
        asyncValidators: [ userPwzValidator.validate.bind(userPwzValidator) ],
        updateOn: 'blur'
      }),
      pesel: new FormControl({value: this.doctor ? this.doctor.pesel : null, disabled: this.doctor?.pesel ? true : false}, {
        validators: [ 
          Validators.required,
          Validators.minLength(11), 
          Validators.maxLength(11), 
          CustomValidator.patternMatch(/^[0-9]{11}$/, {onlyNumbers : true})],
          asyncValidators: [ userPeselValidator.validate.bind(userPeselValidator) ],
          updateOn: 'blur'

      }),
      nip: new FormControl({value: this.doctor ? this.doctor.nip : null, disabled: false}, {
        validators: [         
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidator.patternMatch(/^[0-9]{10}$/, { onlyNumbers: true })],
        asyncValidators: [ userNipValidator.validate.bind(userNipValidator) ],
        updateOn: 'blur'
      }),
      officeName: new FormControl({value: this.doctor ? this.doctor.officeName : null, disabled: false}, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      officeAddress: new FormControl({value: this.doctor ? this.doctor.officeAddress : null, disabled: false}, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(sameAddresses),
      officeCorrespondenceAddress: new FormControl(null),
      examFormat: new FormControl({value: this.doctor ? this.doctor.examFormat : 'jpeg', disabled: false}, {
        validators: [Validators.required]
      }),
      tomographyWithViewer: new FormControl({value: this.doctor ? this.doctor.tomographyWithViewer : false, disabled: false})
    });

    if (this.user) {      
      this.mode = 'edit';
      if (this.currentUser && (this.currentUser.role === Role.user || this.currentUser.role === Role.sadmin )) {
        this.form.disable();
      }
      this.form.controls.email.clearValidators();

    } else {
      this.mode = 'create';
    }

    this.sameAddresses$ = this.form.controls.sameAddresses.valueChanges
      .pipe(
        startWith(sameAddresses),
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
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(AppActions.loadingStart());
    const newDoctor: Doctor = {
      _id: this.user ? this.user.doctor._id : null,
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
      _id: this.user ? this.user._id : null,
      email: this.form.value.email,
      role: Role.doctor,
      rulesAccepted: this.user ? this.user.rulesAccepted : false,
      active: this.user ? this.user.active : false,
      lab: this.user ? this.user.lab : this.lab,
      doctor: newDoctor
    });

    //TODO zamienic na store
    if (this.mode === 'create') {
      this.doctorService.addUser(newUser).pipe(
        take(1),
        finalize(() => this.store.dispatch(AppActions.loadingEnd())))
      .subscribe(
        () => this.goOut(),
        err=>   this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      );
    } else {     
      this.doctorService.updateUser(newUser).pipe(
        take(1),
        finalize(() => this.store.dispatch(AppActions.loadingEnd())))
      .subscribe(
        () => this.goOut(),
        err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      );
    }
  }

  private goOut() {
    this.router.navigate(['/user/doctor/list']);
  }
}
