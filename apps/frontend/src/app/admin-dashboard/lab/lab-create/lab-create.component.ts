import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LabService } from '../../../_services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { InfoComponent } from '../../../common-dialogs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'zabek-lab-create',
  templateUrl: './lab-create.component.html',
  styleUrls: ['./lab-create.component.css']
})
export class LabCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;

  constructor(
    private readonly labService: LabService,
    public readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(20)]
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(20)]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("labId")) {
        this.mode = "edit";
        this._id = paramMap.get("labId");
        this.isLoading = true;
        this.labService.getLab(this._id).subscribe(labData => {
          this.isLoading = false;
          this.form.setValue({
            name: labData.name,
            email: labData.email,
            address: labData.address
          });
        });
      } else {
        this.mode = "create";
        this._id = null;
      }
    });
  }

  onSaveLab() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === "create") {
      this.labService.addLab({...this.form.value}).subscribe(res => {
        this.router.navigate(['/admin/lab']);
      },
      err => {
        this.dialog.open(InfoComponent, { data:  err });

      });
    } else {
      this.labService.updateLab({ _id: this._id, ...this.form.value}).subscribe(res => {
        this.router.navigate(['/admin/lab']);
      },
      err => {
        this.dialog.open(InfoComponent, { data:  err });
      });
    }
    this.isLoading = false;
  }
}
