import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OptionEntry, DataSource } from '../search-select/';
import { map } from 'rxjs/operators';
import { DoctorService } from '../../../_services';
import { Doctor } from '@zabek/data';

@Component({
  selector: 'zabek-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent implements OnInit {
  
  ours = new FormControl(null, [Validators.required]);
  dataSource: DataSource;

  constructor (private readonly doctorService: DoctorService) {}

  ngOnInit() {
    const displayValue= (value: string): Observable<OptionEntry | null> => {
      if (!value) return of(null);
      return this.doctorService.getDoctor(value).pipe(
        map((e: Doctor) => e? ({
          value: e._id,
          display: `${e.lastName} ${e.firstName} ${e.qualificationsNo ? e.qualificationsNo : ''}`,
          details: {}
        }): null)
      );
    }

    const search = (term: string): Observable<OptionEntry[]> => {
      return this.doctorService.getDoctors(20,0, {sort: 'lastNeme-,firstName-', term})
        .pipe(
          map(result => result.doctors),
          map(list => list.map((e: Doctor) => ({
            value: e._id,
            display: `${e.lastName} ${e.firstName} ${e.qualificationsNo ? e.qualificationsNo : ''}`,
            details: {}
          }))));
    }

    this.dataSource = { displayValue, search };
  }
}
