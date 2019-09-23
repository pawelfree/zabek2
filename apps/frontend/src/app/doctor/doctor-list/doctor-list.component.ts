import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { DoctorListDataSource } from '../_datasource/doctor-list.datasource';
import { DoctorService } from '../../_services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'zabek-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: [ './doctor-list.component.css' ]
})
export class DoctorListComponent implements OnInit, AfterViewInit  {
  doctorsPerPage = 10;
  currentPage = 1;

  displayedColumns = ['firstName', 'lastName', 'email', 'actions'];
  dataSource: DoctorListDataSource;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( private readonly doctorService: DoctorService ) {}

  ngOnInit() {
    this.dataSource = new DoctorListDataSource(this.doctorService, this.doctorsPerPage);   
    this.dataSource.loadDoctors(this.currentPage, this.doctorsPerPage);
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadDoctorsPage())
        )
        .subscribe();
  }

  loadDoctorsPage() {
    this.dataSource.loadDoctors( this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  onActivate(id: string) {
    this.doctorService.activate(id)
      .subscribe(res => {
        this.loadDoctorsPage();
      });
  }

}