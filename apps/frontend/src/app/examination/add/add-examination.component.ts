import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ExaminationService} from '../examination.service';
import {FormControl, Validators} from '@angular/forms';
import {Examination} from '../examination';

@Component({
  selector: 'zabek-add-examination',
  templateUrl: './add-examination.html',
  styleUrls: ['./add-examination.css']
})

export class AddExaminationComponent {
  constructor(public dialogRef: MatDialogRef<AddExaminationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Examination,
              public dataService: ExaminationService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addExamination(this.data);
  }
}
