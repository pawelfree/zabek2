import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lab } from '@zabek/data';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { RegisterLabListDataSource } from './register-lab-list.datasource';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Component({
  selector: 'zabek-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.css']
})
export class RegisterListComponent implements OnInit {
  displayedColumns = ['name', 'email', 'address', 'actions'];
  dataSource: RegisterLabListDataSource;
  labs$;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    let params = new HttpParams();
    params = params.append('pagesize', '20');
    params = params.append('page', '0');
    this.labs$ = this.http.get<{labs: Lab[], count: number}>(BACKEND_URL, { params }).pipe(map(res => res.labs))
  
    this.dataSource = new RegisterLabListDataSource(this.labs$);  
  
  }

}
