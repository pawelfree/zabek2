import { createAction, props } from '@ngrx/store';
import { Lab } from '../../../_models'

export const fetchLabs = createAction('[Lab] Fetch labs'); 
export const setLabs = createAction('[Lab] Set labs', props<{labs: Lab[], count: number}>())
export const deleteLab = createAction('[Lab] Delete lab', props<{id: string}>());
export const setLabsPerPage = createAction('[Lab] Set labs per page', props<{labsPerPage: number}>());
export const setCurrentPage = createAction('[Lab] Set current page', props<{page: number}>());
