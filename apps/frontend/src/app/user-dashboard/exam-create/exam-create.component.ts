import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExamService, DoctorService } from '../../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PeselValidator, CustomValidator } from '../../_validators';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Doctor } from '../../_models';
import { MatDialog } from '@angular/material';
import { InfoComponent } from '../../common-dialogs';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { getAge } from '@zabek/util';

@Component({
  selector: 'zabek-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: {
                  parse: {
                      dateInput: "DD-MM-YYYY"
                  },
                  display: {
                      dateInput: "DD-MM-YYYY",
                      monthYearLabel: "MMMM YYYY",
                      dateA11yLabel: "LL",
                      monthYearA11yLabel: "MMMM YYYY"
                  }
                }
    }
  ],
})
export class ExamCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;
  private doctorsSub: Subscription = null;
  public selectedDoctor;

  doctors: Doctor[];
  
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
    private readonly dialog: MatDialog
  ) {}

  ngOnDestroy() {
    if (this.doctorsSub) {
      this.doctorsSub.unsubscribe();
      this.doctorsSub = null;
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.doctorsSub = this.doctorService.getAllDoctors().subscribe(res => {
      this.doctors = res;
      this.isLoading = false;
    },
    error => {
      this.dialog.open(InfoComponent, { data:  error });
      this.doctors = [];
      this.isLoading = false;
    })
    
    this.form = new FormGroup({      
      examinationDate: new FormControl(new Date(), {
        validators: [Validators.required]
      }),
      examinationType: new FormControl(null, {
        validators: [Validators.required] // Czy potrzebny jest customwoy validator, ktory sprawdzi czy wartosc jest elementem ze slownika?
     }),      
      examinationFile: new FormControl(null, { 
      }),
      patientFullName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      patientPesel: new FormControl(null, {
        validators: [ Validators.required, 
                      Validators.minLength(11), 
                      Validators.maxLength(11), 
                      CustomValidator.patternMatch(/^[0-9]{11}$/, {onlyNumbers : true}),
                      PeselValidator.validPesel ]
      }),
      patientAge: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(3)]
      }),
      patientAck: new FormControl(false, {
        validators: [Validators.required]
      }),
      doctor: new FormControl(null, {
        validators: [Validators.required ]
      }),
      sendEmailTo: new FormControl(null, {
        validators: [Validators.required, Validators.email] // ten email powinien się podpowiadac z profilu lekarza, ale user moze go zmienic
      })
    });

    this.route.paramMap.pipe(take(1)).
      subscribe((paramMap: ParamMap) => {
      if (paramMap.has("examId")) {
        this.mode = "edit";
        this._id = paramMap.get("examId");
        this.isLoading = true;
        this.examService.getExam(this._id).pipe(take(1)).subscribe(examData => {
          this.isLoading = false;
          this.selectedDoctor = examData.doctor;
          this.form.setValue({
            examinationDate:  examData.examinationDate,
            examinationType:  examData.examinationType,
            examinationFile:  examData.examinationFile,
            patientFullName:  examData.patientFullName,
            patientPesel:     examData.patientPesel,
            patientAge:       examData.patientAge,
            patientAck:       examData.patientAck,
            doctor:           examData.doctor,
            sendEmailTo:      examData.sendEmailTo,
          });
        },
        error => {
          this.dialog.open(InfoComponent, { data:  error });
          this.isLoading = false;          
          this.selectedDoctor = null;
        });
      } else {
        this.mode = "create";
        this._id = null;       
        this.selectedDoctor = null;
      }
    }); 
  }  
 
  onSaveExam() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const exam = {
      _id: this._id ? this._id : null,
      examinationDate:  this.form.value.examinationDate,
      examinationType:  this.form.value.examinationType,
      examinationFile:  this.form.value.examinationFile,
      patientFullName:  this.form.value.patientFullName,
      patientPesel:     this.form.value.patientPesel,
      patientAge:       this.form.value.patientAge,
      patientAck:       this.form.value.patientAck,
      sendEmailTo:      this.form.value.sendEmailTo,
      doctor:           this.form.value.doctor     
    }
    if (this.mode === "create") {
      this.examService.addExam(exam);
    } else {
      this.examService.updateExam(exam);
    }
    this.isLoading = false;    
  }

  compareDoctors(o1: any, o2: any): boolean {
    return  o1._id === o2._id;
  }

  peselChanged() {
    this.form.patchValue({patientAge: getAge(this.form.value.patientPesel)})
  }
}