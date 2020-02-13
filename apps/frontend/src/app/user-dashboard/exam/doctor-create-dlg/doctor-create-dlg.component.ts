import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CustomValidator,
  PeselValidator,
  NIPValidator,
  PwzValidator,
  UserEmailValidator
} from '../../../_validators';
import { Observable } from 'rxjs';
import { tap, startWith, take } from 'rxjs/operators';
import { Doctor } from '@zabek/data';
import { DoctorService } from '../../../_services';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState, AppActions } from '../../../store';

@Component({
  selector: 'zabek-doctor-create-dlg',
  templateUrl: './doctor-create-dlg.component.html',
  styleUrls: ['./doctor-create-dlg.component.css']
})
export class DoctorCreateDlgComponent implements OnInit {
  form: FormGroup;

  onAdd = new EventEmitter();
  sameAddresses$: Observable<any>;

  constructor(
    private readonly doctorService: DoctorService,
    private readonly dialogRef: MatDialogRef<DoctorCreateDlgComponent>,
    private readonly store: Store<AppState>,
    private readonly userEmailValidator: UserEmailValidator
  ) {}

  ngOnInit() {
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
          Validators.minLength(5),
          Validators.maxLength(25)
        ]
      }),
      qualificationsNo: new FormControl(null, {
        validators: [
          PwzValidator.validPwz
        ]
      }),
      pesel: new FormControl(null, {
        validators: [
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidator.patternMatch(/^[0-9]{11}$/, { onlyNumbers: true }),
          PeselValidator.validPesel
        ]
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
    const doctor: Doctor = { ...this.form.value, _id: null,
      officeCorrespondenceAddress: this.form.value.sameAddresses
        ? this.form.value.officeAddress
        : this.form.value.officeCorrespondenceAddress,
    };

    this.doctorService.addDoctor(doctor).pipe(take(1)).subscribe(
      (res: Doctor) => {
        this.store.dispatch(AppActions.sendInfo({info: 'Nowy lekarz został dodany.'}))
        this.onAdd.emit(res);
        this.dialogRef.close();
      },
      err => this.store.dispatch(AppActions.raiseError({message: err, status: null}))
    );
  }
 
}
