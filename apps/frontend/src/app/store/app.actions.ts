import { createAction, props } from '@ngrx/store';

export const loadingStart = createAction('[App] Loading start'); 
export const loadingEnd = createAction('[App] Loading end');
export const raiseError = createAction('[App] Raise error', props<{message : string, status: string}>());
export const clearError = createAction('[App] Clear error');
export const sendInfo = createAction('[App] Send info', props<{info: string}>());
export const clearInfo = createAction('[App] Clear info');
