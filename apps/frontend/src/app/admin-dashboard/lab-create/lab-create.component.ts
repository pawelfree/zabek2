import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LabService } from '../../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Lab } from '../../_models';

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
    public labService: LabService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
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
      this.labService.addLab( {
        name: this.form.value.name,
        email: this.form.value.email,
        address: this.form.value.address }
      );
    } else {
      this.labService.updateLab({
        _id: this._id,
        name: this.form.value.name,
        email: this.form.value.email,
        address: this.form.value.address}
      );
    }
    this.isLoading = false;
    this.form.reset();
  }
}
