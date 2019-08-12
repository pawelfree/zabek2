import { Component, OnInit, OnDestroy } from '@angular/core';
import { Office } from '../../_models';
import { PageEvent } from '@angular/material';
import { OfficeService } from '../../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.css']
})
export class OfficeListComponent implements OnInit, OnDestroy  {
  dataSubscription: Subscription;
  offices: Office[] = [];
  isLoading = false;
  totalOffices = 0;
  officesPerPage = 15;
  currentPage = 1;

  constructor(
    private readonly officeService: OfficeService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.officeService.getOffices(this.officesPerPage, this.currentPage);
    this.dataSubscription = this.officeService
      .getOfficeUpdateListener()
      .subscribe((officeData: { offices: Office[]; officeCount: number }) => {
        this.isLoading = false;
        this.totalOffices = officeData.officeCount;
        this.offices = officeData.offices;
      });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  onDelete(officeId: string) {
    this.isLoading = true;
    this.officeService.deleteOffice(officeId).subscribe(
      () => {
        this.officeService.getOffices(this.officesPerPage, this.currentPage);
      },
      err => {
        this.officeService.getOffices(this.officesPerPage, this.currentPage);
      }
    );
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.officesPerPage = event.pageSize;
    this.officeService.getOffices(this.officesPerPage, this.currentPage);
  }

}
