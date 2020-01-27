import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Examination } from '../../_models'
import { of, Observable } from 'rxjs';
import { ExamService } from '../../_services';

@Injectable({ providedIn: 'root' }) 
export class ExaminationListResolver implements Resolve<{exams: Examination[], count: number}> {

  constructor(private readonly examService: ExamService) { } 
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{exams: Examination[], count: number}> {
    return this.examService.getExams();
  }

} 
