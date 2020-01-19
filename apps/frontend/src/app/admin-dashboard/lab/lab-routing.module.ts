import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { LabListComponent } from './lab-list/lab-list.component';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { AuthGuard } from '../../_guards';
import { Role } from '../../_models';
import { LabsResolver } from './services';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
        path: 'list',
        component: LabListComponent,
        canActivate: [AuthGuard],
        resolve: {labs: LabsResolver},
        data: { roles: [Role.sadmin] }
    },
    {
      path: 'create',
      component: LabCreateComponent,
      canActivate: [AuthGuard],
      data: { 
        mode: 'create',
        roles: [Role.sadmin] }
    },
    {
      path: 'edit/:labid',
      component: LabCreateComponent,
      canActivate: [AuthGuard],
      data: { 
        mode: 'edit',
        roles: [Role.sadmin] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabRoutingModule {}