import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { InfoComponent } from '../../../common-dialogs';
import { MatDialog } from '@angular/material';
import { Lab } from '../../../_models';
import { LabEntityService } from '../services';
import { map, first, catchError, tap } from 'rxjs/operators';
import { noop, of } from 'rxjs';
import { EntityActionFactory, EntityOp } from '@ngrx/data';

@Component({
  selector: 'zabek-lab-create',
  templateUrl: './lab-create.component.html',
  styleUrls: ['./lab-create.component.css']
})
export class LabCreateComponent implements OnInit {

  form: FormGroup;
  mode: 'create' | 'edit';
  lab: Lab;

  constructor(
    private readonly labEntityService: LabEntityService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(20)]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
    });

    let lab_id = ''; 
    this.mode = this.route.snapshot.data.mode;

    if (this.mode === 'edit') {
      lab_id = this.route.snapshot.paramMap.get('labid');
      this.labEntityService.entities$.pipe(
        map(labs => labs.find(lab => lab._id === lab_id )),
        first()
      ).subscribe(
        lab => {
          this.lab = lab;
          this.form.setValue({address: lab.address, name: lab.name, email: lab.email })
        }
      )
    }
  }

  onSaveLab() {
    if (this.form.invalid) {
      return;
    }

    if (this.form.untouched) {
      //TODO ustawic wlasciwy adres nawigacji - wewnatrz nodulu
      this.router.navigate(['/admin/lab/list']);
      return;
    }

    const lab: Lab = {
      ...this.lab,
      ...this.form.value
    }

    if (this.mode === 'edit' && this.lab.name !== lab.name && this.lab.address !== lab.address) {
      this.labEntityService.update(lab).subscribe(
        noop,
        err => {
          console.log(err)
          const entityActionFactory = new EntityActionFactory();
          const action = entityActionFactory.create('Lab',EntityOp.UNDO_ONE, lab._id)
          this.labEntityService.dispatch(action)
        }
      );
      //TODO ustawic wlasciwy adres nawigacji - wewnatrz nodulu
      this.router.navigate(['/admin/lab/list']);
    } else if (this.mode === 'create') {
      this.labEntityService.add(lab).subscribe(
        newLab => {
          //TODO ustawic wlasciwy adres nawigacji - wewnatrz nodulu
          this.router.navigate(['/admin/lab/list']);
        },
        err => {
          this.dialog.open(InfoComponent, { data:  err.error });
        }
      )
    }
  }
}
