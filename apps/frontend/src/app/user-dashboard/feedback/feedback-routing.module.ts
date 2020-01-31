import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FeedbackListResolver } from './feedback-list/feedback-list.resolver';

import { AuthGuard } from '../../_guards';
import { Role } from '@zabek/data';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
        path: 'list',
        component: FeedbackListComponent,
        resolve: { feedbacks: FeedbackListResolver },
        canActivate: [AuthGuard],
        data: { roles: [Role.sadmin] }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeedbackRoutingModule {}