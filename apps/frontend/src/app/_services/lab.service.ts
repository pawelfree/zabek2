import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Lab } from '../_models';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable({ providedIn: 'root' })
export class LabService {
  private labs: Lab[] = [];
  private labsUpdated = new Subject<{ labs: Lab[]; labCount: number }>();

  constructor(private readonly http: HttpClient) {}


  getLabs(labsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${labsPerPage}&page=${currentPage}`;
    this.http
      .get<{ labs: any; count: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(labsData => {
          return {
            labs: labsData.labs.map(lab => {
              return {
                name: lab.name,
                email: lab.email,
                address: lab.address,
                _id: lab._id
              };
            }),
            count: labsData.count
          };
        })
      )
      .subscribe(
        transformedLabsData => {
          this.labs = transformedLabsData.labs;
          this.labsUpdated.next({
            labs: [...this.labs],
            labCount: transformedLabsData.count
          });
        },
        err => {
          this.labs = [];
          this.labsUpdated.next({ labs: [], labCount: 0 });
        }
      );
  }

  getLabUpdateListener() {
    return this.labsUpdated.asObservable();
  }

  getLab(id: string) {
    //TODO any
    return this.http.get<any>(BACKEND_URL + id);
  }

  deleteLab(labId: string) {
    return this.http.delete(BACKEND_URL + labId);
  }
}