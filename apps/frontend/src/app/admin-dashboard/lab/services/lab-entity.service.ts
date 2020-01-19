import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Lab } from '../../../_models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LabEntityService extends EntityCollectionServiceBase<Lab> {

  totalCount$: Observable<number>;
  paging$: Observable<{page: number, pagesize: number}>;
  
  constructor(private readonly sef: EntityCollectionServiceElementsFactory){
    super('Lab', sef);
    this.totalCount$ = this.selectors$['totalCount$'];
    this.paging$ = this.selectors$['paging$'];
  }

}
