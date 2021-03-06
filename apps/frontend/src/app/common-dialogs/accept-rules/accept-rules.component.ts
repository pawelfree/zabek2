import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  templateUrl: './accept-rules.component.html',
  styleUrls: ['./accept-rules.component.css']
})
export class AcceptRulesComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AcceptRulesComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  showRegulations() {
    window.open('regulations.html', "_blank");
  }
}