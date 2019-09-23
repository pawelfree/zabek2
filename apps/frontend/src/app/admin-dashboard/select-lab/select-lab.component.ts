import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LabService } from '../../_services';
import { MatPaginator, MatDialogRef } from '@angular/material';
import { tap } from 'rxjs/operators';
import { LabListDataSource } from '../_datasource/lab-list.datasource';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './select-lab.component.html',
  styleUrls: ['./select-lab.component.css']
})
export class SelectLabComponent implements OnInit, AfterViewInit, OnDestroy {
  labsPerPage = 5;
  currentPage = 0;

  displayedColumns = ['name', 'address'];
  dataSource: LabListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor (
    private readonly labService: LabService,
    private readonly dialogRef: MatDialogRef<SelectLabComponent>, 
  ) { }

  ngOnInit() {
    this.dataSource = new LabListDataSource(this.labService, this.labsPerPage);   
    this.dataSource.loadLabs(this.currentPage, this.labsPerPage);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.loadLabsPage())
        )
        .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadLabsPage() {
    this.dataSource.loadLabs( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onRowClicked(row){
    this.dialogRef.close(row)
  }

}
