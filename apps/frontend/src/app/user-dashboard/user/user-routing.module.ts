import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '../../_guards';
import { Role } from '@zabek/data';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditResolver } from './user-create/user-create.resolver';
import { UserListResolver } from './user-list/user-list.resolver';

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
      resolve: {users$ : UserListResolver },
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
      resolve: {user: UserEditResolver},
      canActivate: [AuthGuard],
      data: { roles: [Role.admin, Role.sadmin] }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}