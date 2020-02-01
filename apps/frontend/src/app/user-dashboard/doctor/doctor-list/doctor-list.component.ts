import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { DoctorListDataSource } from './doctor-list.datasource';
import { DoctorService } from '../../../_services';
import { tap, catchError, take } from 'rxjs/operators';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { User } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationComponent } from '../../../common-dialogs/confirmation/confirmation.component';

@Component({
  selector: 'zabek-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: [ './doctor-list.component.css' ]
})
export class DoctorListComponent implements OnInit, AfterViewInit, OnDestroy  {

  doctorsPerPage = 10;
  currentPage = 0;
  dataCount = 0; 

  private doctors = new BehaviorSubject<User[]>([]);
  private doctors$ = this.doctors.asObservable();
  
  displayedColumns = ['firstName', 'lastName', 'email', 'actions'];
  dataSource: DoctorListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readonly doctorService: DoctorService,
              private readonly route: ActivatedRoute,
              public dialog: MatDialog) {}

  ngOnInit() {  
    
    this.dataSource = new DoctorListDataSource(this.doctors$);

    const data = this.route.snapshot.data.doctors;
    this.dataCount = data.count;
    this.doctors.next(data.doctors);
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
    this.loadDoctors( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onActivate(id: string) {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '350px',
        data: 'Czy na pewno chcesz aktywować konto online wybranego lekarza?'
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
        if (result) {
          this.doctorService.activate(id).subscribe(res => {
            this.loadDoctorsPage();
          });
        }
      });


  }

  loadDoctors(pageIndex = 0, pageSize = this.doctorsPerPage) {
    return this.doctorService.getOnlineDoctors(pageSize, pageIndex) 
      .pipe(
        take(1),
        tap(result => {
          this.dataCount = result.count;
          this.doctors.next(result.doctors);
        }),
        catchError(() => of<User[]>([])),
      ).subscribe();
  }

}