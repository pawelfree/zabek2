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
import { User } from '@zabek/data';

@Component({
  selector: 'zabek-doctor-create',
  templateUrl: './doctor-create.component.html',
  styleUrls: ['./doctor-create.component.css']
})
export class DoctorCreateComponent implements OnInit {
  form: FormGroup;
  private mode: 'create' | 'edit';
  private _id: string;
  private lab_id: string;

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
      tap(user => this.lab_id = user.lab._id)
    ).subscribe();

    const doctor = this.route.snapshot.data.doctor;
    const sameAddresses = doctor ? (doctor.officeAddress === doctor.officeCorrespondenceAddres ? true : false) : true;

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      lab: new FormControl(null),
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
      tomographyWithViewer: new FormControl(false),
      active: new FormControl(null),
      rulesAccepted: new FormControl(null)
    });

    if (doctor) {
      this.mode = 'edit';
      this._id = doctor._id;
      this.form.setValue({
        email: doctor.email,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        lab: doctor.lab,
        qualificationsNo: doctor.qualificationsNo,
        officeName: doctor.officeName,
        sameAddresses,
        officeAddress: doctor.officeAddress,
        officeCorrespondenceAddress: doctor.officeCorrespondenceAddres,
        examFormat: doctor.examFormat,
        tomographyWithViewer: doctor.tomographyWithViewer,
        active: doctor.active,
        rulesAccepted: doctor.rulesAccepted,
        nip: doctor.nip,
        pesel: doctor.pesel
      });
    } else {
      this.mode = 'create';
      this._id = null;
      this.form.patchValue({lab: this.lab_id});
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
    const doctor: User = { ...this.form.value, _id: this._id ? this._id : null,
      officeCorrespondenceAddres: this.form.value.sameAddresses
        ? this.form.value.officeAddress
        : this.form.value.officeCorrespondenceAddress,
    };
    console.log('nie zaimplementowane dodawanie lekarza', doctor)
    // if (this.mode === 'create') {
    //   this.doctorService.addUser(doctor).pipe(take(1)).subscribe(
    //     () => this.goOut(),
    //     err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
    //   );
    // } else {     
      //TODO update doctor
      // this.doctorService.updateDoctor(doctor).pipe(take(1)).subscribe(
      //   () => this.goOut(),
      //   err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      // );
    // }
  }

  private goOut() {
    this.router.navigate(['/user/doctor/list']);
  }
}
