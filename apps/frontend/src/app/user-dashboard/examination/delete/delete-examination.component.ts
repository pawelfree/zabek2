import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ExaminationService} from '../examination.service';


@Component({
  selector: 'zabek-delete-examination',
  templateUrl: './delete-examination.html',
  styleUrls: ['./delete-examination.css']
})
export class DeleteExaminationComponent {

  constructor(public dialogRef: MatDialogRef<DeleteExaminationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ExaminationService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteExamination(this.data.id);
  }
}
