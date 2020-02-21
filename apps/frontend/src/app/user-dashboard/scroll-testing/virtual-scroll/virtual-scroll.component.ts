import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Doctor } from '@zabek/data';
import { BehaviorSubject, from } from 'rxjs';
import { map, take, tap, scan, switchMap, distinct, toArray, refCount } from 'rxjs/operators';
import { DoctorService } from '../../../_services';


@Component({
  selector: 'zabek-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent {

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  doctors = new BehaviorSubject<Doctor[]>([]);
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

  constructor(private readonly doctorService: DoctorService) {}

  getBatch() {
    if (!this.theEnd) {
      this.doctorService
        .getDoctors(this.pageSize, this.page)
        .pipe(
          take(1),
          map(res => res.doctors),
          tap(res => {
            this.theEnd = res.length < this.pageSize;
            this.page += 1;
          })
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
    if (end >= total) {
      this.getBatch();
    }
  }

}