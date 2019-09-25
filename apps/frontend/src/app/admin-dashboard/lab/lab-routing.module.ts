import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { LabListComponent } from './lab-list/lab-list.component';
import { LabCreateComponent } from './lab-create/lab-create.component';
import { AuthGuard } from '../../_guards';
import { Role } from '../../_models';

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
        data: { roles: [Role.sadmin] }
    },
    {
      path: 'create',
      component: LabCreateComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.sadmin] }
    },
    {
      path: 'edit/:labId',
      component: LabCreateComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.sadmin] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LabRoutingModule {}