import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExamService, DoctorService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { PeselValidator, CustomValidator } from '../../_validators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Doctor, Examination } from '@zabek/data';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, from } from 'rxjs';
import { take, tap, map, scan, switchMap, distinct, toArray } from 'rxjs/operators';
import { getAge, isFemale } from '@zabek/util';
import { DoctorCreateDlgComponent } from '../doctor-create-dlg/doctor-create-dlg.component';
import { AppActions, AppState } from '../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'zabek-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD-MM-YYYY'
        },
        display: {
          dateInput: 'DD-MM-YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class ExamCreateComponent implements OnInit {
  form: FormGroup;
  private mode: 'edit' | 'create' = 'create';
  private _id: string;
  public selectedDoctor;

  endOfData: boolean;
  doctors = new BehaviorSubject<Doctor[]>([]);
  doctors$ = this.doctors.asObservable().pipe(
    scan((acc, curr) => {
      return [...acc, ...curr];
    }, <Doctor[]>[]),
    switchMap(arr =>
      from(arr).pipe(
        distinct(single => single._id),
        toArray()
      )
    )
  );

  emptyDoctor = { _id: 0, email: null }

  private page = 0;
  private pageLen = 10;
  // TODO: to powinna być lista zarządzalna przez superadmina lub admina per placówka?
  examTypes: string[] = [
    'AP czaszki',
    'cefalometryczne',
    'pantomograficzne',
    'pantomograficzne i cefalometryczne',
    'pantomograficzne z opisem',
    'punktowe',
    'tomografia 5x5',
    'tomografia 8x9 i tomografia 12x9 (zatoki)',
    'tomografia 12x9',
    'tomografia 12x9 i pantomograficzne',
    'tomografia 16x9',
    'inne'
  ];

  constructor(
    private readonly examService: ExamService,
    private readonly doctorService: DoctorService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      examinationDate: new FormControl(new Date(), {
        validators: [Validators.required]
      }),
      examinationType: new FormControl(null, {
        validators: [Validators.required]
      }),
      examinationFile: new FormControl(null, {}),
      patientFullName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      }),
      patientPesel: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomValidator.patternMatch(/^[0-9]{11}$/, { onlyNumbers: true }),
          PeselValidator.validPesel
        ]
      }),
      patientOtherID: new FormControl(null, {}),
      patientAge: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3)
        ]
      }),
      patientIsFemale: new FormControl(null, {
        validators: [Validators.required]
      }),
      patientProcessingAck: new FormControl(false, {
        validators: [Validators.required]
      }),
      patientMarketingAck: new FormControl(false, {}),
      patientEmail: new FormControl(null, {
        validators: [Validators.email]
      }),
      patientPhone: new FormControl(null, {}),
      doctor: new FormControl(null, {}),
      sendEmailTo: new FormControl(null, {
        validators: [Validators.email]
      })
    });

    this.endOfData = false;
    this.getNextDoctorsBatch();

    const exam: Examination = this.route.snapshot.data.examination;
    if (exam) {
      this.mode = 'edit';
      this._id = exam._id;
      this.selectedDoctor = exam.doctor;
      this.form.setValue({
        examinationDate: exam.examinationDate,
        examinationType: exam.examinationType,
        examinationFile: exam.examinationFile,
        patientFullName: exam.patientFullName,
        patientPesel: exam.patientPesel,
        patientOtherID: exam.patientOtherID,
        patientAge: exam.patientAge,
        patientIsFemale: exam.patientIsFemale,
        patientProcessingAck: exam.patientProcessingAck,
        patientMarketingAck: exam.patientMarketingAck,
        patientEmail: exam.patientEmail,
        patientPhone: exam.patientPhone,
        doctor: exam.doctor,
        sendEmailTo: exam.sendEmailTo
      });
      setTimeout(() => { 
        if (this.selectedDoctor) {
          this.doctors.next([this.selectedDoctor]);
        }
        else {
          this.selectedDoctor = this.emptyDoctor;
        }
      }, 1);
    } else {
      this.mode = 'create';
      this._id = null;
    }
  }

  getNextDoctorsBatch() {
    if (!this.endOfData) {
      this.doctorService
        .getDoctors(this.pageLen, this.page)
        .pipe(
          take(1),
          map(res => res.doctors),
          tap(res => {
            this.endOfData = res.length < this.pageLen;
            this.page += 1;
          })
        )
        .subscribe(res => this.doctors.next(res));
    }
  }

  onSaveExam() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(AppActions.loadingStart());
    const exam = {
      _id: this._id ? this._id : null,
      examinationDate: this.form.value.examinationDate,
      examinationType: this.form.value.examinationType,
      examinationFile: this.form.value.examinationFile,
      patientFullName: this.form.value.patientFullName,
      patientPesel: this.form.value.patientPesel,
      patientOtherID: this.form.value.patientOtherID,
      patientAge: this.form.value.patientAge,
      patientIsFemale: this.form.value.patientIsFemale,
      patientProcessingAck: this.form.value.patientProcessingAck,
      patientMarketingAck: this.form.value.patientMarketingAck,
      patientEmail: this.form.value.patientEmail,
      patientPhone: this.form.value.patientPhone,
      sendEmailTo: this.form.value.sendEmailTo,
      doctor:
        (this.form.value.doctor === null || undefined) || (this.form.value.doctor._id === 0) ? null : this.form.value.doctor
    };
    if (this.mode === 'create') {
      this.examService.addExam(exam);
    } else {
      this.examService.updateExam(exam);
    }
  }

  compareDoctors(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }

  peselChanged() {
    this.form.patchValue({ patientAge: getAge(this.form.value.patientPesel) });
    this.form.patchValue({ patientIsFemale: isFemale(this.form.value.patientPesel) });
  }

  doctorChanged(event) {
    if (event.isUserInput) {   
      this.form.patchValue({ sendEmailTo: event.source.value.email });
    }
  }

  openDoctorCreateDialog() {
    const dialogRef = this.dialog.open(DoctorCreateDlgComponent, {
      disableClose: true
    });
    const subs = dialogRef.componentInstance.onAdd.subscribe(
      (res: Doctor) => this.doctors.next([res]),
      err => console.log('cos poszlo nie tak')
    );

    dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      if (subs) {
        subs.unsubscribe();
      }
    });

  }
}
