import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LabService } from '../../_services';
import { MatPaginator, MatDialogRef } from '@angular/material';
import { tap } from 'rxjs/operators';
import { LabListDataSource } from '../_datasource/lab-list.datasource';

@Component({
  templateUrl: './select-lab.component.html',
  styleUrls: ['./select-lab.component.css']
})
export class SelectLabComponent implements OnInit, AfterViewInit {
  labsPerPage = 2;
  currentPage = 1;

  displayedColumns = ['name', 'address'];
  dataSource: LabListDataSource;

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
    this.paginator.page
        .pipe(
            tap(() => this.loadLabsPage())
        )
        .subscribe();
  }

  loadLabsPage() {
    this.dataSource.loadLabs( this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  onRowClicked(row){
    this.dialogRef.close(row)
  }

}
