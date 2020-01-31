import { Injectable } from '@angular/core';
import { ExamService } from '../../../_services';
import { Examination } from '@zabek/data';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class ExamEditResolver implements Resolve<Examination> {

  constructor(private readonly examService: ExamService) { } 

  resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Examination> {   
    if (route.paramMap.has('examId')) {
      const _id = route.paramMap.get('examId');
      return this.examService.getExam(_id);      
    } else {
        return of(null);
    } 
  }

}
