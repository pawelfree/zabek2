import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { LabListDataSource } from './lab-list.datasource';
import { LabService } from '../../_services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'zabek-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements AfterViewInit, OnInit  {
  labsPerPage = 15;
  currentPage = 1;

  displayedColumns = ['name', 'email', 'address', 'actions'];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly labService: LabService,
  ) {}

  ngOnInit() {
    this.dataSource = new LabListDataSource(this.labService);
    this.dataSource.loadLabs(1, this.labsPerPage);
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadLabsPage())
        )
        .subscribe();
  }

  loadLabsPage() {
      this.dataSource.loadLabs( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onDelete(labId: string) {
  }

}
