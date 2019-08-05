import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExaminationService } from '../examination.service'
import { Examination } from '../examination';
import {AddExaminationComponent} from '../add/add-examination.component';
import {EditExaminationComponent} from '../edit/edit-examination.component';
import {DeleteExaminationComponent} from '../delete/delete-examination.component';

@Component({
  selector: 'zabek-examination-list',
  templateUrl: './examination-list.component.html',
  styleUrls: ['./examination-list.component.css']
})
export class ExaminationListComponent implements OnInit {
    displayedColumns: string[] = [
      'id',
      'examinationDate',
      'examinationType',
      'patientFullName',
      'patientPesel',
      'patientAge',    
      'doctorFullName',
      'doctorQualificationsNo',
      'doctorOfficeName',
      'patientAck',
      'examinationFile',
      'actions'
    ];
  
    exampleDatabase: ExaminationService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: number;
  
    constructor(
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public dataService: ExaminationService
    ) {}
  
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
  
    ngOnInit() {
      this.loadData();
    }
  
    refresh() {
      this.loadData();
    }
  
    addNew(examination: Examination) {
      const dialogRef = this.dialog.open(AddExaminationComponent, {
        data: {examination: examination }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          // After dialog is closed we're doing frontend updates
          // For add we're just pushing a new row inside DataService
          this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
          this.refreshTable();
        }
      });
    }
  
    startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
      this.id = id;
      // index row is used just for debugging proposes and can be removed
      this.index = i;
      console.log(this.index);
      const dialogRef = this.dialog.open(EditExaminationComponent, {
        data: {id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          // When using an edit things are little different, firstly we find record inside DataService by id
          const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
          // Then you update that record using data from dialogData (values you enetered)
          this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
        }
      });
    }
  
    deleteItem(i: number, id: number, title: string, state: string, url: string) {
      this.index = i;
      this.id = id;
      const dialogRef = this.dialog.open(DeleteExaminationComponent, {
        data: {id: id, title: title, state: state, url: url}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
          // for delete we use splice in order to remove single object from DataService
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
        }
      });
    }
  
  
    private refreshTable() {
      // Refreshing table using paginator
      // Thanks yeager-j for tips
      // https://github.com/marinantonio/angular-mat-table-crud/issues/12
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  
    public loadData() {
      this.exampleDatabase = new ExaminationService(this.httpClient);
      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
      fromEvent(this.filter.nativeElement, 'keyup')
        // .debounceTime(150)
        // .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    }
  }
  
  //TODO - do zmiany, czy to w ogole powinno byc w tym pliku?
  export class ExampleDataSource extends DataSource<Examination> {
    _filterChange = new BehaviorSubject('');
  
    get filter(): string {
      return this._filterChange.value;
    }
  
    set filter(filter: string) {
      this._filterChange.next(filter);
    }
  
    filteredData: Examination[] = [];
    renderedData: Examination[] = [];
  
    constructor(
      public _exampleDatabase: ExaminationService,
      public _paginator: MatPaginator,
      public _sort: MatSort
    ) {
      super();
      // Reset to the first page when the user changes the filter.
      this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
    }
  
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Examination[]> {
      // Listen for any changes in the base data, sorting, filtering, or pagination
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._sort.sortChange,
        this._filterChange,
        this._paginator.page
      ];
  
      this._exampleDatabase.getAllExaminations();
  
      return merge(...displayDataChanges).pipe(
        map(() => {
          // Filter data
          this.filteredData = this._exampleDatabase.data.slice().filter((examination: Examination) => {
              const searchStr = (
                examination.id +
                examination.examinationDate +
                examination.doctorFullName +
                examination.patientFullName
              ).toLowerCase();
              return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });
  
          // Sort filtered data
          const sortedData = this.sortData(this.filteredData.slice());
  
          // Grab the page's slice of the filtered sorted data.
          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          this.renderedData = sortedData.splice(
            startIndex,
            this._paginator.pageSize
          );
          return this.renderedData;
        })
      );
    }
  
    disconnect() {}
  
    /** Returns a sorted copy of the database data. */
    sortData(data: Examination[]): Examination[] {
      if (!this._sort.active || this._sort.direction === '') {
        return data;
      }
  
      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';
  
        switch (this._sort.active) {
          case 'id':
            [propertyA, propertyB] = [a.id, b.id];
            break;
          case 'examinationDate':
            [propertyA, propertyB] = [a.examinationDate, b.examinationDate];
            break;
          case 'doctorLastName':
            [propertyA, propertyB] = [a.doctorFullName, b.doctorFullName];
            break;
          case 'patientLastName':
            [propertyA, propertyB] = [a.patientFullName, b.patientFullName];
            break;
          case 'patientPesel':
            [propertyA, propertyB] = [a.patientPesel, b.patientPesel];
            break;
          case 'examinationType':
            [propertyA, propertyB] = [a.examinationType, b.examinationType];
            break;
        }
  
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  
        return (
          (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
        );
      });
    }
  }
  