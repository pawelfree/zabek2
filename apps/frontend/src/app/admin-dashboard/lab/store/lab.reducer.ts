import { Lab } from '../../../_models';
import * as LabActions from './lab.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  labs: Lab[];
  count: number;
  loading: boolean;
  labsPerPage: number;
  currentPage: number;
}

const initialState: State = {
  labs: [],
  count: 0,
  loading: false,
  labsPerPage: 2,
  currentPage: 0,
};

const _labReducer = createReducer(initialState,
  on(LabActions.setLabsPerPage, (state, {labsPerPage}) => ({...state, labsPerPage})),
  on(LabActions.setLabs, (state, {labs, count} ) => ({...state, labs, count, loading: false})),
  on(LabActions.fetchLabs, (state ) => ({...state, labs:[], count: 0, loading: true })),
  on(LabActions.deleteLab, (state, {id})=> ({...state})),
  on(LabActions.setCurrentPage, (state, {page}) => ({...state, currentPage: page}))
);

export function labReducer(state, action ) {
  return _labReducer(state, action);
}
