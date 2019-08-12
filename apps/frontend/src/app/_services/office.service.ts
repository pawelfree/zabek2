import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Office } from '../_models';

const BACKEND_URL = environment.apiUrl + '/api/office/';

@Injectable({ providedIn: 'root' })
export class OfficeService {
  private offices: Office[] = [];
  private officesUpdated = new Subject<{ offices: Office[]; officeCount: number }>();

  constructor(private readonly http: HttpClient) {}


  getOffices(officesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${officesPerPage}&page=${currentPage}`;
    this.http
      .get<{ offices: any; count: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(officesData => {
          return {
            offices: officesData.offices.map(office => {
              return {
                name: office.name,
                _id: office._id
              };
            }),
            count: officesData.count
          };
        })
      )
      .subscribe(
        transformedOfficesData => {
          this.offices = transformedOfficesData.offices;
          this.officesUpdated.next({
            offices: [...this.offices],
            officeCount: transformedOfficesData.count
          });
        },
        err => {
          this.offices = [];
          this.officesUpdated.next({ offices: [], officeCount: 0 });
        }
      );
  }

  getOfficeUpdateListener() {
    return this.officesUpdated.asObservable();
  }

  getOffice(id: string) {
    //TODO any
    return this.http.get<any>(BACKEND_URL + id);
  }

  deleteOffice(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }
}