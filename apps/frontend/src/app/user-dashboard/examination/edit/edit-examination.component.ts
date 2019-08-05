import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ExaminationService} from '../examination.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'zabek-edit-examination',
  templateUrl: './edit-examination.html',
  styleUrls: ['./edit-examination.css']
})
export class EditExaminationComponent {

  constructor(public dialogRef: MatDialogRef<EditExaminationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ExaminationService) { }

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

  stopEdit(): void {
    this.dataService.updateExamination(this.data);
  }
}
