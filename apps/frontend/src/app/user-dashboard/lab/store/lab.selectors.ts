import {createFeatureSelector} from '@ngrx/store';
import { LabState } from './lab.reducer';


export const selectLabState = createFeatureSelector<LabState>('lab');
