import { Lab } from '../../../_models';
import * as LabActions from './lab.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface LabState {
  labs: Lab[];
  count: number;
  labsPerPage: number;
  page: number;
  lab: Lab;
  error: string
}

const initialState: LabState = {
  labs: [],
  count: 0,
  labsPerPage: 10,
  page: 0,
  lab: null,
  error: null
};

const _labReducer = createReducer(initialState,
  on(LabActions.setLabsPerPage, (state, {labsPerPage}) => ({...state, labsPerPage})),
  on(LabActions.setLabs, (state, {labs, count} ) => ({...state, labs, count, error: null})),
  on(LabActions.fetchLabs, (state, {page}) => ({...state, labs:[], page, count: 0, error: null})),
  on(LabActions.deleteLab, (state, {_id})=> ({...state, error: null})),
  on(LabActions.addLab,(state, {lab}) => ({...state, lab, error: null})),
  on(LabActions.setLab, (state, {lab}) => ({...state, lab, error: null})),
  on(LabActions.updateLab, (state, {lab}) => ({...state, lab, error: null})),
  on(LabActions.errorLab, (state, {error}) => ({...state, error})),
  on(LabActions.getLab, (state, {_id}) => ({...state, error: null}))
);

export function labReducer(state, action ) {
  return _labReducer(state, action);
}
