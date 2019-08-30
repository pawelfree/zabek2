import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {

  constructor(private readonly dialogRef: MatDialogRef<InfoComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: string) {}

}