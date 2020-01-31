import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Feedback } from '@zabek/data';
import { FeedbackService } from '../../../_services';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class FeedbackListResolver implements Resolve<{feedbacks: Feedback[], count: number}> {

  constructor(private readonly feedbackService: FeedbackService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{feedbacks: Feedback[], count: number}> {
    return this.feedbackService.getFeedbacks();
  }
}