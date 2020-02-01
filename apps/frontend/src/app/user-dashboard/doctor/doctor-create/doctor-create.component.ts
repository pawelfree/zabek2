import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator, PeselValidator, NIPValidator } from '../../../_validators';
import { Observable } from 'rxjs';
import { tap, startWith, take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../_services';
import { PwzValidator } from '../../../_validators';
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

  sameAddresses$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit() {
  
    this.store.pipe(
      select(currentUser),
      take(1),
      tap(user => this.lab = user.lab)
    ).subscribe();

    this.user = this.route.snapshot.data.doctor;
    const sameAddresses = this.user ? (this.user.doctor.officeAddress === this.user.doctor.officeCorrespondenceAddres ? true : false) : true;

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      firstName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      }),
      lastName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25)
        ]
      }),
      qualificationsNo: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(7),
          CustomValidator.patternMatch(/^[0-9]{7}$/, { onlyNumbers: true }),
          PwzValidator.validPwz
        ]
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
        validators: [Validators.required, Validators.minLength(5)]
      }),
      officeAddress: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(sameAddresses),
      officeCorrespondenceAddress: new FormControl(null),
      examFormat: new FormControl('jpeg', {
        validators: [Validators.required]
      }),
      tomographyWithViewer: new FormControl(false)
    });

    if (this.user) {      
      this.mode = 'edit';
      this.form.setValue({
        email: this.user.email,
        firstName: this.user.doctor.firstName,
        lastName: this.user.doctor.lastName,
        qualificationsNo: this.user.doctor.qualificationsNo,
        officeName: this.user.doctor.officeName,
        sameAddresses,
        officeAddress: this.user.doctor.officeAddress,
        officeCorrespondenceAddress: this.user.doctor.officeCorrespondenceAddres,
        examFormat: this.user.doctor.examFormat,
        tomographyWithViewer: this.user.doctor.tomographyWithViewer,
        nip: this.user.doctor.nip,
        pesel: this.user.doctor.pesel
      });
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
      officeCorrespondenceAddres: this.form.value.sameAddresses
      ? this.form.value.officeAddress
      : this.form.value.officeCorrespondenceAddress,
      examFormat: this.form.value.examFormat,
      tomographyWithViewer: this.form.value.tomographyWithViewer
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
      this.doctorService.addUser(newUser).pipe(take(1)).subscribe(
        () => this.goOut(),
        err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      );
    } else {     
      this.doctorService.updateUser(newUser).pipe(take(1)).subscribe(
        () => this.goOut(),
        err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      );
    }
  }

  private goOut() {
    this.router.navigate(['/user/doctor/list']);
  }
}
