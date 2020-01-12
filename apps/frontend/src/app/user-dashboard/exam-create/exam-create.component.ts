import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExamService, DoctorService } from '../../_services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PeselValidator, CustomValidator } from '../../_validators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { Doctor } from '../../_models';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InfoComponent } from '../../common-dialogs';
import { Observable, BehaviorSubject, from } from 'rxjs';
import {
  take,
  tap,
  map,
  scan,
  switchMap,
  distinct,
  toArray
} from 'rxjs/operators';
import { getAge, isFemale } from '@zabek/util';
import { DoctorCreateDlgComponent } from '../doctor-create-dlg/doctor-create-dlg.component';

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
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;
  public selectedDoctor;
  formDoctorValue = null; //jesli 'Brak' to null

  endOfData: boolean;
  doctors$: Observable<Doctor[]>;
  doctors = new BehaviorSubject<Doctor[]>([]);
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
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    this.doctors$ = this.doctors.asObservable().pipe(
      scan((acc, curr) => {
        return [...acc, ...curr];
      }, [])
    );
  }

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

    if (this.form.value.doctor != null) {
      this.endOfData = false;
      this.doctors$ = this.doctors.asObservable().pipe(
        scan(
          (acc, curr) => {
            return [...acc, ...curr];
          },
          <Doctor[]>[]
        ),
        switchMap(arr =>
          from(arr).pipe(
            distinct(single => single._id),
            toArray()
          )
        )
      );
    }

    this.getNextDoctorsBatch();

    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('examId')) {
        this.mode = 'edit';
        this._id = paramMap.get('examId');
        this.isLoading = true;
        this.examService
          .getExam(this._id)
          .pipe(take(1))
          .subscribe(
            examData => {
              this.isLoading = false;
              this.selectedDoctor = examData.doctor;
              this.form.setValue({
                examinationDate: examData.examinationDate,
                examinationType: examData.examinationType,
                examinationFile: examData.examinationFile,
                patientFullName: examData.patientFullName,
                patientPesel: examData.patientPesel,
                patientOtherID: examData.patientOtherID,
                patientAge: examData.patientAge,
                patientIsFemale: examData.patientIsFemale,
                patientProcessingAck: examData.patientProcessingAck,
                patientMarketingAck: examData.patientMarketingAck,
                patientEmail: examData.patientEmail,
                patientPhone: examData.patientPhone,
                doctor: examData.doctor,
                sendEmailTo: examData.sendEmailTo
              });
              setTimeout(() => this.doctors.next([this.selectedDoctor]), 1);
            },
            error => {
              this.dialog.open(InfoComponent, { data: error });
              this.isLoading = false;
              this.selectedDoctor = null;
            }
          );
      } else {
        this.mode = 'create';
        this._id = null;
        this.selectedDoctor = null;
      }
    });
    console.log(this.form);
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

    // if ((this.form.value.doctor = '0')) {
    //   this.formDoctorValue = null;
    // } else {
    //   this.formDoctorValue = this.form.value.doctor;
    // }

    this.isLoading = true;
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
      doctor: this.form.value.doctor//this.formDoctorValue
    };
    if (this.mode === 'create') {
      console.log(exam);
      this.examService.addExam(exam);
    } else {
      this.examService.updateExam(exam);
    }
    this.isLoading = false;
  }

  compareDoctors(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }

  peselChanged() {
    this.form.patchValue({ patientAge: getAge(this.form.value.patientPesel) });
    this.form.patchValue({
      patientIsFemale: isFemale(this.form.value.patientPesel)
    });
  }

  // TODO: jak zaktualizować sendEmail jesli: najpierw wybiore jakiegos lekarza (ustawi sie jego emsila w sendTo), a potem wybiore Brak
  // teraz jest bug bo w sendtTo zostanie ostatni email lekarza, a powinno być pusto
  doctorChanged(event) {
    if (event.isUserInput) {
      this.form.patchValue({ sendEmailTo: event.source.value.email });
    }
  }

  openDoctorCreateDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DoctorCreateDlgComponent, dialogConfig);

    // TODO: BUG: zamkniecie modala nie powinno zamykac formualrza tworzenia/edycji badania. Teraz zamyka i wraca do listy badan.
    dialogRef.afterClosed().subscribe(data => {
      console.log('DEBUG: Doctor create dialog output:', data);
      this.router.navigate(['.'], { relativeTo: this.route });
    });
  }
}
