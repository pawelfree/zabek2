import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Doctor } from '@zabek/data';
import { Observable } from 'rxjs';


@Component({
  selector: 'zabek-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent implements AfterViewInit {

  @ViewChild(CdkVirtualScrollViewport)
  vieport: CdkVirtualScrollViewport;


  infinitedata: Observable<Doctor[]>;

  ngAfterViewInit() {


  }


  handler(event) {

  }
}