import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Lab } from '../../../_models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LabsDataService extends DefaultDataService<Lab> {
  constructor(http: HttpClient,
              httpUrlGenerator: HttpUrlGenerator) {
    super('Lab', http, httpUrlGenerator)
  }

  getAll(): Observable<Lab[]> {
    return super.getAll().pipe(
      map((res: any) => {
        const data = res.labs;
        data.totalCount = res.count;
        return data as any;
      }),
    );
  }

  getWithQuery(params: QueryParams): Observable<Lab[]> {
    const new_params = { ...params, pagesize: environment.LAB_PAGESIZE.toString()}
    return super.getWithQuery(new_params).pipe(
      map((res: any) => {
        const data = res.labs;
        data.paging = res.paging;
        data.totalCount = res.count;
        return data as any;
      })
    )
  }

  add(entity: Lab): Observable<Lab> {
    return super.add(entity);
  }

  delete(key: string | number): Observable<string | number> {
    return super.delete(key);
  }

}
