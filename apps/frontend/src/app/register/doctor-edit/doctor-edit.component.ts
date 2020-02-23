import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator, UserNipValidator } from '../../_validators';
import { Observable, noop } from 'rxjs';
import { tap, startWith, finalize } from 'rxjs/operators';
import { Doctor, User, Role } from '@zabek/data';
import { DoctorService } from '../../_services'
import { Store } from '@ngrx/store';
import { AppState, AppActions } from '../../store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'zabek-doctor-register',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.css']
})
export class DoctorEditComponent implements OnInit { 
  form: FormGroup;
  sameAddresses$: Observable<any>;
  
  constructor(
    private readonly doctorService: DoctorService,
    private readonly store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public readonly user: User,
    private readonly dialogRef: MatDialogRef<DoctorEditComponent>,
  ){}

  ngOnInit() {

    const doctor: Doctor = this.user.doctor;
    const userNipValidator = new UserNipValidator(this.doctorService, doctor);

    this.form = new FormGroup({
      email: new FormControl({ value: this.user.email, disabled: true }),
      firstName: new FormControl(this.user.doctor.firstName, {
        validators: [ Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(25)]
      }),
      lastName: new FormControl(this.user.doctor.lastName, {
        validators: [ Validators.required,
                      Validators.minLength(2),
                      Validators.maxLength(25)]
      }),    
      qualificationsNo: new FormControl({ value: this.user.doctor.qualificationsNo, disabled: true }),  
      pesel: new FormControl({ value: this.user.doctor.pesel, disabled: true }),
      nip: new FormControl(this.user.doctor.nip, {
        validators: [         
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidator.patternMatch(/^[0-9]{10}$/, { onlyNumbers: true })],
        asyncValidators: [ userNipValidator.validate.bind(userNipValidator) ],
        updateOn: 'blur'         
      }),
      officeName: new FormControl(this.user.doctor.officeName, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),   
      officeAddress: new FormControl(this.user.doctor.officeAddress, {
        validators: [ Validators.required,
                      Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(true), 
      officeCorrespondenceAddress: new FormControl(this.user.doctor.officeCorrespondenceAddress),
      examFormat: new FormControl(this.user.doctor.examFormat ? this.user.doctor.examFormat : 'jpeg', {
        validators: [ Validators.required]
      }),    
      tomographyWithViewer: new FormControl(this.user.doctor.tomographyWithViewer )   
    });

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

    this.store.dispatch(AppActions.loadingStart());
    const newDoctor: Doctor = {
      _id: this.user.doctor._id,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      pesel: this.user.doctor.pesel,
      nip: this.form.value.nip,
      qualificationsNo: this.user.doctor.qualificationsNo,
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
      _id: this.user._id,
      email: this.user.email,
      role: Role.doctor,
      rulesAccepted: this.user.rulesAccepted,
      active: this.user.active,
      lab: this.user.lab,
      doctor: newDoctor
    });

    this.dialogRef.close();

    this.store.dispatch(AppActions.loadingEnd());
    this.doctorService.updateUserMe(newUser).pipe(finalize(() => {
      this.store.dispatch(AppActions.loadingEnd());
      this.dialogRef.close();
    })).subscribe(
      noop,
      err => this.store.dispatch(AppActions.raiseError({message: err, status: 'Aktualizacja danych lekarza.'}))
    );
  }
  
}
