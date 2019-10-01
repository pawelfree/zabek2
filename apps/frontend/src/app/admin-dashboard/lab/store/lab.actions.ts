import { createAction, props } from '@ngrx/store';
import { Lab } from '../../../_models'

export const fetchLabs = createAction('[Lab] Fetch labs', props<{page: number}>()); 
export const setLabs = createAction('[Lab] Set labs', props<{labs: Lab[], count: number}>())
export const deleteLab = createAction('[Lab] Delete lab', props<{_id: string}>());
export const setLabsPerPage = createAction('[Lab] Set labs per page', props<{labsPerPage: number}>());
export const addLab = createAction('[Lab] Add lab', props<{lab: Lab}>());
export const updateLab = createAction('[Lab] Update lab', props<{lab: Lab}>());
export const errorLab = createAction('[Lab] Lab create/update error', props<{error: any}>());
export const getLab = createAction('[Lab] Get single lab', props<{_id: string}>());
export const setLab = createAction('[lab] Set single lab', props<{lab: Lab}>());