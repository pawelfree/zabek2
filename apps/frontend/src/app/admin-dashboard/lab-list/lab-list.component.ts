import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lab } from '../../_models';
import { PageEvent } from '@angular/material';
import { LabService } from '../../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements OnInit, OnDestroy  {
  dataSubscription: Subscription;
  labs: Lab[] = [];
  isLoading = false;
  totalLabs = 0;
  labsPerPage = 15;
  currentPage = 1;

  constructor(
    private readonly labService: LabService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.labService.getLabs(this.labsPerPage, this.currentPage);
    this.dataSubscription = this.labService
      .getLabUpdateListener()
      .subscribe((labData: { labs: Lab[]; labCount: number }) => {
        this.isLoading = false;
        this.totalLabs = labData.labCount;
        this.labs = labData.labs;
      });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  onDelete(labId: string) {
    this.isLoading = true;
    this.labService.deleteLab(labId).subscribe(
      () => {
        this.labService.getLabs(this.labsPerPage, this.currentPage);
      },
      err => {
        this.labService.getLabs(this.labsPerPage, this.currentPage);
      }
    );
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.labsPerPage = event.pageSize;
    this.labService.getLabs(this.labsPerPage, this.currentPage);
  }

}
