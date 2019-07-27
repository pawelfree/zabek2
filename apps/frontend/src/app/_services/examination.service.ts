import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Examination } from '../_models';

@Injectable({ providedIn: 'root' })
export class ExaminationService {
  private readonly DATA = '../assets/examinations.json';
  dataChange: BehaviorSubject<Examination[]> = new BehaviorSubject<Examination[]>([]);
  
  // Temporarily stores data from dialogs
  dialogData: any;
  
  constructor(private httpClient: HttpClient) {}

  get data(): Examination[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getAllExaminations(): void {
    this.httpClient.get<Examination[]>(this.DATA).subscribe(
      data => {
        this.dataChange.next(data);        
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  addExamination (examination: Examination): void {
    this.dialogData = examination;
  }

  updateExamination (examination: Examination): void {
    this.dialogData = examination;
  }

  deleteExamination (id: number): void {
    console.log(id);
  }
}
