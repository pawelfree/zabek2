import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CustomValidator,
  PeselValidator,
  NIPValidator
} from '../../_validators';
import { Observable, Subscription } from 'rxjs';
import { tap, startWith, take } from 'rxjs/operators';
import { Doctor, User } from '../../_models';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { DoctorService } from '../../_services';
import { PwzValidator } from '../../_validators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InfoComponent } from '../../common-dialogs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';


@Component({
  selector: 'zabek-doctor-create-dlg',
  templateUrl: './doctor-create-dlg.component.html',
  styleUrls: ['./doctor-create-dlg.component.css']
})
export class DoctorCreateDlgComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;

  private _id: string;
  private user: User;

  sameAddresses$: Observable<boolean>;
  private officeAddressSubs: Subscription;
  private storeSub: Subscription = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly doctorService: DoctorService,
    private readonly store: Store<AppState>,
    private readonly createDoctorDlgRef: MatDialogRef<DoctorCreateDlgComponent>,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(state => {
      this.user = state.user;
    });

    this.isLoading = false;
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email]
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

    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('doctorId')) {

        this._id = paramMap.get('doctorId');
        this.isLoading = true;
        this.doctorService
          .getDoctor(this._id)
          .pipe(take(1))
          .subscribe(
            examData => {
              this.isLoading = false;
              this.form.setValue({
                email: examData.email,
                firstName: examData.firstName,
                lastName: examData.lastName,
                lab: examData.lab._id,
                qualificationsNo: examData.qualificationsNo,
                officeName: examData.officeName,
                sameAddresses:
                  this.form.value.officeAddress ===
                  this.form.value.officeCorrespondenceAddress
                    ? true
                    : false,
                officeAddress: examData.officeAddress,
                officeCorrespondenceAddress:
                  examData.officeCorrespondenceAddres,
                examFormat: examData.examFormat,
                tomographyWithViewer: examData.tomographyWithViewer,
                active: examData.active,
                rulesAccepted: examData.rulesAccepted,
                nip: examData.nip,
                pesel: examData.pesel
              });
            },
            error => {
              this.dialog.open(InfoComponent, { data: error });
              this.isLoading = false;
            }
          );
      } else {

        this._id = null;
      }
    });

    this.officeAddressSubs = this.form.controls.sameAddresses.valueChanges
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
          this.sameAddresses$ = value;
        })
      )
      .subscribe();

    this.createDoctorDlgRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.onCancel();
      }
    });

    this.createDoctorDlgRef.backdropClick().subscribe(event => {
      this.onCancel();
    });
  }

  onCancel(): void {
    this.form.value.cancel = true;
    this.createDoctorDlgRef.close(this.form.value);
  }

  ngOnDestroy() {
    if (this.officeAddressSubs) {
      this.officeAddressSubs.unsubscribe();
    }
    this.officeAddressSubs = null;

    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
  }

  // TODO: na poprzednim widoku - formularzu tworzenia badania,
  // ustawić nowo utworzonego lekarza jako wybranego z listy
  onAddNewDoctor() {
    if (this.form.invalid) {
      return;
    }
    const doctor = new Doctor(
      null, //id
      this.form.value.email,
      this.form.value.lab ? this.form.value.lab : this.user.lab,
      null, //password
      null, //expiresIn
      null, //_tokenExpirationDate?
      null, //_token
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.officeName,
      this.form.value.officeAddress,
      this.form.value.qualificationsNo,
      this.form.value.sameAddresses
        ? this.form.value.officeAddress
        : this.form.value.officeCorrespondenceAddress,
      this.form.value.examFormat,
      this.form.value.tomographyWithViewer,
      this.form.value.active,
      this.form.value.rulesAccepted,
      this.form.value.pesel,
      this.form.value.nip
    );
    this.isLoading = true;
    this.doctorService.addDoctor(doctor).subscribe(
      // do metody close() poniżej przekażemy id utworzonego właśnie lekarza, który ma być ustawiony na liście wyboru
      res => this.createDoctorDlgRef.close(this.form.value),
      err => {
        this.dialog.open(InfoComponent, { data: err });
      }
    );
    this.isLoading = false;
  }

  close() {
    console.log("doctor-create-dlg.close() called.");
    this.createDoctorDlgRef.close();
  }

 
}
