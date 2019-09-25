import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '../../_guards';
import { Role } from '../../_models';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
        path: 'list',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.admin, Role.sadmin] }
    },
    {
      path: 'create',
      component: UserCreateComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.admin, Role.sadmin] }
    },
    {
      path: 'edit/:userId',
      component: UserCreateComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.admin, Role.sadmin] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}