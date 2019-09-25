import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { LabListDataSource } from './lab-list.datasource';
import { LabService } from '../../../_services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements AfterViewInit, OnInit, OnDestroy  {
  labsPerPage = 10;
  currentPage = 0;

  displayedColumns = ['name', 'email', 'address', 'actions'];
  dataSource: LabListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly labService: LabService,
  ) {}

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

  onDelete(id: string) {
    //TODO obsluga bledow
    this.labService.deleteLab(id)
      .subscribe(res => {
        if (this.dataSource.itemsOnPage === 1 ) {
          this.paginator.pageIndex = this.paginator.pageIndex -1;
        }
        this.loadLabsPage();
      }
    );
  }

}
