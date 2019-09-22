import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExamService } from '../../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Examination } from '../../_models';

@Component({
  selector: 'zabek-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.css']
})
export class ExamCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;

  constructor(
    public examService: ExamService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      //TODO zaktualizowac warunki dla pol badania
      examinationDate: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10)] // chyba potrzebny jest validator na date w formacie polskim
      }),
      examinationType: new FormControl(null, {
        validators: [Validators.required] // Czy potrzebny jest customwoy validator, ktory sprawdzi czy wartosc jest elementem ze slownika?
      }),      
      examinationFile: new FormControl(null, { // TODO: jak obsluzyc validator dla pliku badania?
        validators: [Validators.nullValidator] 
      }),
      patientFullName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      patientPesel: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)]
      }),
      patientAge: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(3)]
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
            //TODO uzupełnić pozostałe pola z badania
            examinationDate: examData.examinationDate,
            examinationType: examData.examinationType,
            examinationFile: examData.examinationFile,
            patientFullName: examData.patientFullName,
            patientPesel: examData.patientPesel,
            patientAge: examData.patientAge
          });
        });
      } else {
        this.mode = "create";
        this._id = null;        
      }
    });

  }
// TODO dodac pozostałe pola
  onSaveExam() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.examService.addExam( {
        examinationDate: this.form.value.examinationDate,
        examinationType: this.form.value.examinationType,
        examinationFile: this.form.value.examinationFile,
        patientFullName: this.form.value.patientFullName,
        patientPesel: this.form.value.patientPesel,
        patientAge: this.form.value.patientAge }
      );
    } else {
      this.examService.updateExam({
        _id: this._id,
        examinationDate: this.form.value.examinationDate,
        examinationType: this.form.value.examinationType,
        examinationFile: this.form.value.examinationFile,
        patientFullName: this.form.value.patientFullName,
        patientPesel: this.form.value.patientPesel,
        patientAge: this.form.value.patientAge}
      );
    }
    this.isLoading = false;
    this.form.reset();
  }
}