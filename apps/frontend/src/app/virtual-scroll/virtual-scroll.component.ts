import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Doctor } from '@zabek/data';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { DoctorService } from '../_services';
import { map, take, tap, scan, switchMap, distinct, toArray } from 'rxjs/operators';


@Component({
  selector: 'zabek-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent implements AfterViewInit {

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  doctors = new BehaviorSubject<Doctor[]>([]);
  // doctors$ = this.doctors.asObservable().pipe(
  //   scan((acc, curr) => {
  //     return [...acc, ...curr];
  //   }, <Doctor[]>[]),
  //   switchMap(arr =>
  //     from(arr).pipe(
  //       distinct(single => single._id),
  //       toArray()
  //     )
  //   )
  // );

  infinitedata$ = this.doctors.asObservable()
    .pipe(
      scan((acc, curr) => [...acc, ...curr], <Doctor[]>[]),
      switchMap((arr: Doctor[]) => from(arr)
        .pipe(
          distinct(single => single._id),
          toArray()
        )
      )
    )

  pageSize = 10;
  page = 0;
  theEnd = false;
  pagesVisited = new Set<number>();

  constructor(private readonly doctorService: DoctorService) {}

  ngAfterViewInit() {
    // console.log('ngAfter')
    // this.getBatch();
  }

  getBatch() {
    // if (this.pagesVisited.has(this.page)) {
    //   return;
    // }
    if (!this.theEnd) {
      this.doctorService
        .getDoctors(this.pageSize, this.page)
        .pipe(
          take(1),
          map(res => res.doctors),
          tap(res => {
            this.theEnd = res.length < this.pageSize;
            this.page += 1;
          }),
          tap(res => console.log('called',res))
        )
        .subscribe(res => this.doctors.next(res));
    }
  }


  handler(event) {
    if (this.theEnd) {
      return;
    }
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log('end === total', end, total);
    
    if (end === total) {
      this.getBatch();
    }
  }

}