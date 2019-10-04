import { Directive, OnInit, OnDestroy, AfterViewInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import { MatSelect, SELECT_ITEM_HEIGHT_EM } from '@angular/material';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[SelectInfiniteScroll]'
})
export class SelectInfiniteScroll implements OnInit, OnDestroy, AfterViewInit {

  @Output() infiniteScroll = new EventEmitter();
  @Input() complete: boolean; 
  @Input() threshold = '15%';

  private gracePx = 0;
  private gracePc = 0;

  private openedChangeSub: Subscription;
  private scrollSub: Subscription;
  private onDestroy = new Subject();

  constructor(private readonly matSelect: MatSelect) {}

  ngOnInit() {
    this.complete = false
    this.calcGraceDistance();
  }

  private calcGraceDistance() {
    if (this.threshold.lastIndexOf('%') > -1) {
      this.gracePx = 0;
      this.gracePc = (parseFloat(this.threshold) / 100);
    } else {
      this.gracePx = parseFloat(this.threshold);
      this.gracePc = 0;
    }
  }

  ngOnDestroy() { 
    if (this.openedChangeSub) {
      this.openedChangeSub.unsubscribe();
    }
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngAfterViewInit() { 
    this.openedChangeSub = this.matSelect.openedChange.subscribe(opened => {
      if (opened) { 
        this.registerScrollListener();
      }
    });
  }

  private registerScrollListener() {
    this.scrollSub = fromEvent(this.panel, 'scroll').pipe(
      takeUntil(this.onDestroy),
      tap(event => this.handleScrollEvent(event))
    ).subscribe();
  }

  private handleScrollEvent(event) {
    if (this.complete) {
      return;
    }
    
    const scrollDistance = this.getSelectItemHeightPx() * this.matSelect.options.length;
    const threshold = this.gracePc !== 0 ? (scrollDistance * this.gracePc) : this.gracePx;
    const distanceToScroll = this.panel.clientHeight + event.target.scrollTop;

    if ((distanceToScroll + threshold) >= scrollDistance) {
      this.infiniteScroll.emit();
    }
  }

  getSelectItemHeightPx(): number {
    return parseFloat(getComputedStyle(this.matSelect.panel.nativeElement).fontSize) * SELECT_ITEM_HEIGHT_EM;
  }

  get panel() {
    return this.matSelect.panel.nativeElement;
  }
}



