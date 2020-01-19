import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LabEntityService } from './lab-entity.service';
import { tap, filter, first } from 'rxjs/operators';

@Injectable() 
export class LabsResolver implements Resolve<boolean> { 

  constructor(private labsService: LabEntityService) {}

  resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<boolean> {  
    return this.labsService.loaded$.pipe(
      tap(loaded => {
        if (!loaded) {
          this.labsService.getWithQuery({page: '0'});
        }
      }),
      filter(loaded => !!loaded),
      first(),
    )
  }
}
