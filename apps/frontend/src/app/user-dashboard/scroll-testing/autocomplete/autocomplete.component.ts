import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { OptionEntry, DataSource } from '../search-select/';
import { map } from 'rxjs/operators';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  hours_worked: number;
  hourly_wage: number;
}

const apiURL = 'https://api.angularbootcamp.com/employees';

@Component({
  selector: 'zabek-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent implements OnInit {
  
  ours = new FormControl(null, [Validators.required]);
  dataSource: DataSource;

  constructor (private readonly http: HttpClient) {}

  ngOnInit() {
    const displayValue= (value: any): Observable<OptionEntry | null> => {
      if (typeof value === 'string') {
        value = parseInt(value, 10);
      }
      if (typeof value !== 'number') {
        return of(null);
      }
      return this.http.get<Employee>(apiURL + '/' + value).pipe(
        map((e: Employee) => ({
          value: e.id,
          display: `${e.first_name} ${e.last_name} (${e.email})`,
          details: {}
        }))
      );
    }

    const search = (term: string): Observable<OptionEntry[]> => {
      return this.http.get<Employee[]>(apiURL, {
          params: {
            q: term || '',
            _sort: 'last_name,first_name'
          }
        }).pipe(
          map(list => list.map((e: Employee) => ({
            value: e.id,
            display: `${e.first_name} ${e.last_name} (${e.email})`,
            details: {}
          }))));
    }

    this.dataSource = { displayValue, search };
  }
}
