import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../_validators';
import { Observable, Subscription } from 'rxjs';
import { tap, startWith, take } from 'rxjs/operators';
import { Doctor } from '../../_models';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { DoctorService } from '../../_services';
import { PwzValidator } from '../../_validators';
import { MatDialog } from '@angular/material';
import { InfoComponent } from '../../common-dialogs';

@Component({
  selector: 'zabek-doctor-create',
  templateUrl: './doctor-create.component.html',
  styleUrls: ['./doctor-create.component.css']
})
export class DoctorCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;

  sameAddresses$: Observable<boolean>;
  private officeAddressSubs: Subscription;

  //private queryParams: Params = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.isLoading = false;
    this.form = new FormGroup(
      {
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
        officeName: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(5)]
        }),
        officeAddress: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(5)]
        }),
        sameAddresses: new FormControl(true),
        officeCorrespondenceAddress: new FormControl(null),
        examFormat: new FormControl('jpeg', {
          validators: [Validators.required]
        }),
        tomographyWithViewer: new FormControl(false),
        // password1: new FormControl(null, {
        //   validators: [
        //     Validators.required,
        //     Validators.minLength(8),
        //     CustomValidator.patternMatch(/\d/, { hasNumber: true }),
        //     CustomValidator.patternMatch(/[A-Z]/, { hasCapitalCase: true }),
        //     CustomValidator.patternMatch(/[a-z]/, { hasSmallCase: true }),
        //     CustomValidator.patternMatch(
        //       /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        //       { hasSpecialCharacters: true }
        //     )
        //   ]
        // }),
        // password2: new FormControl(null, {
        //   validators: [Validators.required]
        // })
      },
      // {
      //   validators: CustomValidator.mustMatch('password1', 'password2')
      // }
    );

    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('doctorId')) {
        this.mode = 'edit';
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
                qualificationsNo: examData.qualificationsNo,
                officeName: examData.officeName,
                sameAddresses: this.form.value.sameAddresses ? this.form.value.officeAddress : this.form.value.officeCorrespondenceAddress,
                officeAddress: examData.officeAddress,                
                officeCorrespondenceAddress: examData.officeCorrespondenceAddres,
                examFormat: examData.examFormat,
                tomographyWithViewer: examData.tomographyWithViewer,
                //password: null,
                //password1: null,
                //password2: null
              });              
            },
            error => {
              this.dialog.open(InfoComponent, { data: error });
              this.isLoading = false;              
            }
          );
      } else {
        this.mode = 'create';
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
  }

  ngOnDestroy() {
    if (this.officeAddressSubs) {
      this.officeAddressSubs.unsubscribe();
    }
    this.officeAddressSubs = null;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const doctor = new Doctor(
      null,
      this.form.value.email,
      this.form.value.password1,
      null,
      null,
      null,
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
      false,
      false
    );

    this.doctorService.addDoctor(doctor).subscribe(
      res => this.goOut(),
      err => {
        this.dialog.open(InfoComponent, { data: err });
      }
    );
    this.isLoading = false;
  }

  private goOut() {
    this.router.navigate(['/login']);
  }
}
