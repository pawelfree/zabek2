import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { LabListComponent } from './lab-list/lab-list.component';
import { LabRoutingModule } from './lab-routing.module';
import { EntityMetadataMap, EntityDefinitionService, EntityDataService, } from '@ngrx/data';
import { LabEntityService, LabsResolver, LabsDataService } from './services';
import { Lab } from '../../_models';
import { environment } from '../../../environments/environment';

const entityMetadata: EntityMetadataMap = {
  Lab: {
    selectId: (lab: Lab) => lab._id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
    },
    additionalCollectionState: {
      totalCount: undefined,
      paging: {
        page: 0,
        pagesize: environment.LAB_PAGESIZE
      }
    }
  }
}

@NgModule({
  imports: [
    CommonModule, 
    AngularMaterialModule, 
    ReactiveFormsModule,
    LabRoutingModule,
  ],
  declarations: [
    LabListComponent,
    LabCreateComponent
  ],
  providers: [
    LabEntityService,
    LabsResolver,
    LabsDataService,
  ]
})
export class LabModule {
  constructor(entityDefinitionService: EntityDefinitionService,
              entityDataService: EntityDataService,
              labsDataService: LabsDataService) {
    entityDefinitionService.registerMetadataMap(entityMetadata);
    entityDataService.registerService('Lab', labsDataService);
  }
}