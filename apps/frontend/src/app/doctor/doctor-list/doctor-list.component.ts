import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { DoctorListDataSource } from '../_datasource/doctor-list.datasource';
import { DoctorService } from '../../_services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: [ './doctor-list.component.css' ]
})
export class DoctorListComponent implements OnInit, AfterViewInit, OnDestroy  {
  doctorsPerPage = 2;
  currentPage = 0;

  displayedColumns = ['firstName', 'lastName', 'email', 'actions'];
  dataSource: DoctorListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( private readonly doctorService: DoctorService ) {}

  ngOnInit() {
    this.dataSource = new DoctorListDataSource(this.doctorService, this.doctorsPerPage);   
    this.dataSource.loadDoctors(this.currentPage, this.doctorsPerPage);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.loadDoctorsPage())
        )
        .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadDoctorsPage() {
    this.dataSource.loadDoctors( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onActivate(id: string) {
    this.doctorService.activate(id)
      .subscribe(res => {
        this.loadDoctorsPage();
      });
  }

}