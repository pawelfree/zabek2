import { createAction, props } from '@ngrx/store';
import { User } from '../../../_models'

export const fetchUsers = createAction('[User] Fetch users', props<{page: number}>()); 
export const setUsers = createAction('[User] Set users', props<{users: User[], count: number}>())
export const deleteUser = createAction('[User] Delete user', props<{_id: string}>());
export const setUsersPerPage = createAction('[User] Set users per page', props<{usersPerPage: number}>());
export const addUser = createAction('[User] Add user', props<{user: User}>());
export const updateUser = createAction('[User] Update user', props<{user: User}>());
export const errorUser = createAction('[User] User create/update error', props<{error: any}>());
export const getUser = createAction('[User] Get single user', props<{_id: string}>());
export const setUser = createAction('[User] Set single user', props<{user: User}>());