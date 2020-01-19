import { Injectable } from '@angular/core';
import { DefaultPersistenceResultHandler, EntityAction, DataServiceError, EntityActionDataServiceError, EntityActionFactory, EntityOp } from '@ngrx/data';
import { Action } from '@ngrx/store';
import { Lab } from '../_models';

@Injectable()
export class RtgCloudPersistenceResultHandler extends DefaultPersistenceResultHandler {

  handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);

    return (data: any) => {
      const action = actionHandler(data);

      if (action && data && data.totalCount) {
         (action as any).payload.totalCount = data.totalCount;
      }
      if (action && data && data.paging) {
        (action as any).payload.paging = data.paging;
      }
      return action;
    };
   
  }

}
