import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CustomValidator,
  UserEmailValidator,
  UserPwzValidator,
  UserPeselValidator,
  UserNipValidator
} from '../../../_validators';
import { Observable } from 'rxjs';
import { tap, startWith, take, finalize } from 'rxjs/operators';
import { Doctor, User, Role, Lab } from '@zabek/data';
import { DoctorService } from '../../../_services';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { AppState, AppActions } from '../../../store';
import { currentUser } from '../../../auth/store';

@Component({
  selector: 'zabek-doctor-create-dlg',
  templateUrl: './doctor-create-dlg.component.html',
  styleUrls: ['./doctor-create-dlg.component.css']
})
export class DoctorCreateDlgComponent implements OnInit {
  form: FormGroup;

  onAdd = new EventEmitter();
  sameAddresses$: Observable<any>;
  private lab: Lab;

  constructor(
    private readonly doctorService: DoctorService,
    private readonly dialogRef: MatDialogRef<DoctorCreateDlgComponent>,
    private readonly store: Store<AppState>,
    private readonly userEmailValidator: UserEmailValidator,
    private readonly userPwzValidator: UserPwzValidator,
    private readonly userPeselValidator: UserPeselValidator,
    private readonly userNipValidator: UserNipValidator
  ) {}

  ngOnInit() {

    this.store.pipe(
      select(currentUser),
      take(1),
      tap(user => this.lab = user.lab)
    ).subscribe();

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email],
        asyncValidators: [this.userEmailValidator.validate.bind(this.userEmailValidator)],
        updateOn: 'blur'
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
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      }),
      qualificationsNo: new FormControl(null, {
        asyncValidators: [ this.userPwzValidator.validate.bind(this.userPwzValidator)],
        updateOn: 'blur'
      }),
      pesel: new FormControl(null, {
        validators: [
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidator.patternMatch(/^[0-9]{11}$/, { onlyNumbers: true })],
        asyncValidators: [ this.userPeselValidator.validate.bind(this.userPeselValidator)],
        updateOn: 'blur'
      }),
      nip: new FormControl(null, {
        validators: [
          Validators.minLength(10),
          Validators.maxLength(10),
          CustomValidator.patternMatch(/^[0-9]{10}$/, { onlyNumbers: true })],
          asyncValidators: [ this.userNipValidator.validate.bind(this.userNipValidator)],
          updateOn: 'blur'
      }),
      officeName: new FormControl(null, {
        validators: [Validators.minLength(5)]
      }),
      officeAddress: new FormControl(null, {
        validators: [Validators.minLength(5)]
      }),
      sameAddresses: new FormControl(true),
      officeCorrespondenceAddress: new FormControl(null),
      examFormat: new FormControl('jpeg', {
        validators: []
      }),
      tomographyWithViewer: new FormControl(false),
      active: new FormControl(null),
      rulesAccepted: new FormControl(null)
    });

    this.sameAddresses$ = this.form.controls.sameAddresses.valueChanges
      .pipe(
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

  // TODO: na poprzednim widoku - formularzu tworzenia badania,
  // ustawić nowo utworzonego lekarza jako wybranego z listy
  onAddNewDoctor() {
    if (this.form.invalid) {
      return;
    }
    const doctor: Doctor = { 
      officeAddress: null,
      officeName: null, 
      ...this.form.value, 
      _id: null,
      officeCorrespondenceAddress: this.form.value.sameAddresses
        ? this.form.value.officeAddress
        : this.form.value.officeCorrespondenceAddress,
    };

    let user = null;
    if (this.form.value.email) {
      user = Object.assign( new User(),{
        _id: null,
        email: this.form.value.email,
        role: Role.doctor,
        rulesAccepted: false,
        active: false,
        lab: this.lab,
        doctor
      });
    }

    this.store.dispatch(AppActions.loadingStart());

    if (user) {
      this.doctorService.addUser(user).pipe(
        take(1),
        finalize(() => this.store.dispatch(AppActions.loadingEnd())))
      .subscribe(
        (res: User) => {
          this.store.dispatch(AppActions.sendInfo({info: 'Lekarz został dodany'}));
          this.onAdd.emit(res.doctor);
          this.dialogRef.close();
        },
        err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      )
    } else {
      this.doctorService.addDoctor(doctor).pipe(
        take(1),
        finalize(() => this.store.dispatch(AppActions.loadingEnd()))).subscribe(
        (res: Doctor) => {
          this.store.dispatch(AppActions.sendInfo({info: 'Lekarz został dodany.'}))
          this.onAdd.emit(res);
          this.dialogRef.close();
        },
        err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
      );
    }
  }
}
