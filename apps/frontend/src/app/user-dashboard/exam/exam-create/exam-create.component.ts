import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExamService, DoctorService } from '../../../_services';
import { ActivatedRoute } from '@angular/router';
import { PeselValidator, CustomValidator } from '../../../_validators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Doctor, Examination, Patient, Lab, FileUpload, User, Role } from '@zabek/data';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { take, tap, map, scan, switchMap, distinct, toArray } from 'rxjs/operators';
import { getAge, isFemale } from '@zabek/util';
import { DoctorCreateDlgComponent } from '../doctor-create-dlg/doctor-create-dlg.component';
import { AppActions, AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { currentUser } from '../../../auth/store';

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
export class ExamCreateComponent implements OnInit, OnDestroy {

  form: FormGroup;
  mode: 'edit' | 'create' = 'create';
  private _id: string;
  private lab: Lab;
  private file: FileUpload;
  public selectedDoctor;
  private firstPageOpen;
  private dialogSubs: Subscription = null;

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
  user: User = null;
  examTypes: string[] = [
    'pantomograficzne',
    'wewnątrzustne',
    'cefalometryczne',
    'cbct 5x5',
    'cbct 12x9',
    'cbct 16x9',
    'cbct 8x9',
    'sektorowe',
    'zatok przynosowych',
    'ssż w zwarciu i rozwarciu',
    'ssż w zwarciu',
    'ssż w rozwarciu',
    'skrzydłowo-zgryzowe panto',
    'PA/AP',
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

    this.firstPageOpen = true;

    this.store.pipe(select(currentUser),
      take(1),
      tap(user => {
        this.user = user;
      })
    ).subscribe();
    
    this.form = new FormGroup({
      examinationDate: new FormControl(new Date(), {
        validators: [Validators.required]
      }),
      examinationType: new FormControl(null, {
        validators: [Validators.required]
      }),
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
      this.lab = exam.lab;
      this.file = exam.file;
      this.selectedDoctor = exam.doctor ? exam.doctor : this.emptyDoctor;
      
      this.form.setValue({
        examinationDate: exam.examinationDate,
        examinationType: exam.examinationType,
        patientFullName: exam.patient.fullName,
        patientPesel: exam.patient.pesel,
        patientOtherID: exam.patient.otherID,
        patientAge: exam.patient.age,
        patientIsFemale: exam.patient.female,
        patientProcessingAck: exam.patient.processingAck,
        patientMarketingAck: exam.patient.marketingAck,
        patientEmail: exam.patient.email,
        patientPhone: exam.patient.phone,
        doctor: this.selectedDoctor,
        sendEmailTo: exam.sendEmailTo === undefined  ? null : exam.sendEmailTo
      });
      
      setTimeout(() => { 
        if (this.selectedDoctor._id !== 0) {
          this.doctors.next([this.selectedDoctor]);
        }
        else {
          this.selectedDoctor = this.emptyDoctor;
          this.form.controls['sendEmailTo'].reset({value: null, disabled: true});
        }
      }, 1);
      if (this.user.role === Role.user) {
        this.form.disable()
      }
    } else {
      this.mode = 'create';
      this._id = null;
      this.lab = null;
      this.file = null;
      this.selectedDoctor = this.emptyDoctor;
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
    const patient: Patient = {
      fullName: this.form.value.patientFullName,
      pesel: this.form.value.patientPesel,
      otherID: this.form.value.patientOtherID,
      age: this.form.value.patientAge,
      female: this.form.value.patientIsFemale,
      processingAck: this.form.value.patientProcessingAck,
      marketingAck: this.form.value.patientMarketingAck,
      email: this.form.value.patientEmail,
      phone: this.form.value.patientPhone,
    };

    const exam: Examination = {
      _id: this._id ? this._id : null,
      examinationDate: this.form.value.examinationDate,
      examinationType: this.form.value.examinationType,
      patient,
      lab: this.lab,
      sendEmailTo: this.form.value.sendEmailTo,
      file: this.file,
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
      if (this.firstPageOpen) {
        this.firstPageOpen = false;
      } else {
        if (event.source.value.email !== null) {
          this.form.controls['sendEmailTo'].reset({ value: null, disabled: false});
        } else {
          this.form.controls['sendEmailTo'].reset({ value: null, disabled: true});
        }
      }
    }
  }

  openDoctorCreateDialog() {
    if (this.dialogSubs) {
      this.dialogSubs.unsubscribe();
      this.dialogSubs = null;
    }
    const dialogRef = this.dialog.open(DoctorCreateDlgComponent, {
      disableClose: true
    });
    this.dialogSubs = dialogRef.componentInstance.onAdd.subscribe(
      (res: Doctor) => {
        console.log('next', res);
        
        return this.doctors.next([res]);
      },
      err => console.log('cos poszlo nie tak',err)
    );
  }

  ngOnDestroy(): void {
    if (this.dialogSubs) {
      this.dialogSubs.unsubscribe();
      this.dialogSubs = null;
    }
  }

}
