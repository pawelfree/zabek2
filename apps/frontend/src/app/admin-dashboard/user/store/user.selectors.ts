import {createFeatureSelector} from '@ngrx/store';
import { UserState } from './user.reducer';


export const selectUserState = createFeatureSelector<UserState>('user');
