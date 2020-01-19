import { Injectable } from '@angular/core';
import {
  EntityCollectionReducerMethodMap, EntityDefinitionService,
  EntityAction,
  EntityCollection,
  EntityCollectionReducerMethods,
  EntityDefinition,
} from '@ngrx/data';

@Injectable()
export class RtgCloudEntityCollectionReducerMethodsFactory {
  constructor(private entityDefinitionService: EntityDefinitionService) { }

  create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
    const definition = this.entityDefinitionService.getDefinition<T>(entityName);
    const methodsClass = new RtgCloudEntityCollectionReducerMethods(entityName, definition);

    return methodsClass.methods;
  }
}

export class RtgCloudEntityCollectionReducerMethods<T> extends EntityCollectionReducerMethods<T> {
  constructor(public entityName: string, public definition: EntityDefinition<T>) {
    super(entityName, definition);
  }


  protected saveAddOneSuccess(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T> {
    const ec = super.saveAddOneSuccess(collection, action);
    if ( action.type === '[Lab] @ngrx/data/save/add-one/success' && (action.payload as any).data._id) {
      (ec as any).totalCount += 1;
    }
    return ec;
  }

  protected saveDeleteOneSuccess(collection: EntityCollection<T>, action: EntityAction<string | number>): EntityCollection<T> {
    const ec = super.saveDeleteOneSuccess(collection, action);
    if ( action.type === '[Lab] @ngrx/data/save/delete-one/success' && (action.payload as any).data) {
      (ec as any).totalCount -= 1;
    }
    return ec;
  }

  protected queryAllSuccess( collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T> {
    const ec = super.queryAllSuccess(collection, action);
    if ((action.payload as any).totalCount) {
      (ec as any).totalCount = (action.payload as any).totalCount;
    }
    return ec;
  }

  protected queryManySuccess(
    collection: EntityCollection<T>,
    action: EntityAction<T[]>
  ): EntityCollection<T> {
    const ec = super.queryManySuccess(collection, action)
    if ((action.payload as any).paging) {
      (ec as any).paging = (action.payload as any).paging;
    }
    if ((action.payload as any).totalCount) {
      (ec as any).totalCount = (action.payload as any).totalCount;
    }
    //TODO to jest bardzo watpliwe
    ec.loaded = true;
    return ec;
  }

  protected removeAll(
    collection: EntityCollection<T>,
    action: EntityAction<T>
  ): EntityCollection<T> {
    const ec = super.removeAll(collection, action);
    (ec as any).totalCount = undefined;
    return ec;
  }
}
