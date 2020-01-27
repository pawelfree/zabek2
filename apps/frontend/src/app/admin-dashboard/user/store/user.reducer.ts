import { User } from '@zabek/data';
import * as UserActions from './user.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface UserState {
  users: User[];
  count: number;
  usersPerPage: number;
  page: number;
  user: User;
  error: string
}

const initialState: UserState = {
  users: [],
  count: 0,
  usersPerPage: 10,
  page: 0,
  user: null,
  error: null
};

const _userReducer = createReducer(initialState,
  on(UserActions.setUsersPerPage, (state, {usersPerPage}) => ({...state, usersPerPage})),
  on(UserActions.setUsers, (state, {users, count} ) => ({...state, users, count, error: null})),
  on(UserActions.fetchUsers, (state, {page}) => ({...state, labs:[], page, count: 0, error: null})),
  on(UserActions.deleteUser, (state, {_id})=> ({...state, error: null})),
  on(UserActions.addUser,(state, {user}) => ({...state, user, error: null})),
  on(UserActions.setUser, (state, {user}) => ({...state, user, error: null})),
  on(UserActions.updateUser, (state, {user}) => ({...state, user, error: null})),
  on(UserActions.errorUser, (state, {error}) => ({...state, error})),
  on(UserActions.getUser, (state, {_id}) => ({...state, error: null}))
);

export function userReducer(state, action ) {
  return _userReducer(state, action);
}