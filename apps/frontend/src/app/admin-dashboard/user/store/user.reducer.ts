import { User } from '../../../_models';
import * as UserActions from './user.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  users: User[];
  count: number;
  loading: boolean;
  usersPerPage: number;
  page: number;
  user: User;
  error: string
}

const initialState: State = {
  users: [],
  count: 0,
  loading: false,
  usersPerPage: 10,
  page: 0,
  user: null,
  error: null
};

const _userReducer = createReducer(initialState,
  on(UserActions.setUsersPerPage, (state, {usersPerPage}) => ({...state, usersPerPage})),
  on(UserActions.setUsers, (state, {users, count} ) => ({...state, users, count, loading: false, error: null})),
  on(UserActions.fetchUsers, (state, {page}) => ({...state, labs:[], page, count: 0, loading: true, error: null})),
  on(UserActions.deleteUser, (state, {_id})=> ({...state, error: null, loading: false})),
  on(UserActions.addUser,(state, {user}) => ({...state, user, error: null, loading: true})),
  on(UserActions.setUser, (state, {user}) => ({...state, user, error: null, loading: false})),
  on(UserActions.updateUser, (state, {user}) => ({...state, user, error: null, loading: true})),
  on(UserActions.errorUser, (state, {error}) => ({...state, error, loading: false})),
  on(UserActions.getUser, (state, {_id}) => ({...state, error: null, loading: true}))
);

export function userReducer(state, action ) {
  return _userReducer(state, action);
}
