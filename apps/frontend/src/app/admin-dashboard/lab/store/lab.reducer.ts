import { Lab } from '../../../_models';
import * as LabActions from './lab.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  labs: Lab[];
  count: number;
  loading: boolean;
  labsPerPage: number;
  page: number;
  lab: Lab;
  error: string
}

const initialState: State = {
  labs: [],
  count: 0,
  loading: false,
  labsPerPage: 10,
  page: 0,
  lab: null,
  error: null
};

const _labReducer = createReducer(initialState,
  on(LabActions.setLabsPerPage, (state, {labsPerPage}) => ({...state, labsPerPage})),
  on(LabActions.setLabs, (state, {labs, count} ) => ({...state, labs, count, loading: false, error: null})),
  on(LabActions.fetchLabs, (state, {page}) => ({...state, labs:[], page, count: 0, loading: true, error: null})),
  on(LabActions.deleteLab, (state, {id})=> ({...state, error: null, loading: false})),
  on(LabActions.addLab,(state, {lab}) => ({...state, lab, error: null, loading: true})),
  on(LabActions.setLab, (state, {lab}) => ({...state, lab, error: null, loading: false})),
  on(LabActions.updateLab, (state, {lab}) => ({...state, lab, error: null, loading: true})),
  on(LabActions.errorLab, (state, {error}) => ({...state, error, loading: false})),
  on(LabActions.getLab, (state, {id}) => ({...state, error: null, loading: true}))
);

export function labReducer(state, action ) {
  return _labReducer(state, action);
}
