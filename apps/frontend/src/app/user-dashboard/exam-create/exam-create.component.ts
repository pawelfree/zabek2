import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExamService, DoctorService } from '../../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PeselValidator, CustomValidator } from '../../_validators';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Doctor } from '../../_models';

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
export class ExamCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;
  
  // pobrać z serwisu lekarzy. Wszystkich? A jak ich będzie 2000?
  // Tylko tych zarejestrowanych w danej pracowni?
  // a czy pracownia może zarejestrować lekarza, który jest w innej pracowni zarejestrowany? 
  doctors: Doctor[]; // ['Jan Kowalski', 'Janina Nowak', 'Romuald Kisiel']; 
  
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
    public examService: ExamService,
    public doctorService: DoctorService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.doctors[]= this.doctorService.getAllDoctors;

    this.form = new FormGroup({      
      examinationDate: new FormControl(new Date(), {
        validators: [Validators.required] // chyba potrzebny jest validator na date w formacie polskim
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
      doctorFullName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] //to pole powinno być z listy wyboru, najlepiej typu autocomplete
      }),
      doctorQualificationsNo: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(7), Validators.maxLength(7)]
      }),
      sendEmailTo: new FormControl(null, {
        validators: [Validators.required, Validators.email] // ten email powinien się podpowiadac z profilu lekarza, ale user moze go zmienic
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("examId")) {
        this.mode = "edit";
        this._id = paramMap.get("examId");
        this.isLoading = true;
        this.examService.getExam(this._id).subscribe(examData => {
          this.isLoading = false;
          this.form.setValue({
            examinationDate:  examData.examinationDate,
            examinationType:  examData.examinationType,
            examinationFile:  examData.examinationFile,
            patientFullName:  examData.patientFullName,
            patientPesel:     examData.patientPesel,
            patientAge:       examData.patientAge,
            patientAck:       examData.patientAck,
            doctorFullName:   examData.doctorFullName,
            doctorQualificationsNo: examData.doctorQualificationsNo,
            sendEmailTo:      examData.sendEmailTo
          });
        });
      } else {
        this.mode = "create";
        this._id = null;       
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
      doctorFullName:   this.form.value.doctorFullName,
      doctorQualificationsNo: this.form.value.doctorQualificationsNo
    }
    if (this.mode === "create") {
      this.examService.addExam(exam);
    } else {
      this.examService.updateExam(exam);
    }
    this.isLoading = false;    
  }
}