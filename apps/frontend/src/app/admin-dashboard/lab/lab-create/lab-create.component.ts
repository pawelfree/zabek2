import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { InfoComponent } from '../../../common-dialogs';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { Lab } from '../../../_models';
import { Subscription } from 'rxjs';
import { LabActions, selectLabState } from '../store';
import { LoadingService } from '../../../_services';

@Component({
  selector: 'zabek-lab-create',
  templateUrl: './lab-create.component.html',
  styleUrls: ['./lab-create.component.css']
})
export class LabCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private mode = 'create';
  private _id: string;
  private storeSub: Subscription = null;

  constructor(
    private readonly loading: LoadingService,
    private readonly store: Store<AppState>,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
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

    this.storeSub = this.store.pipe(select(selectLabState)).subscribe(state => {
      if (state.error) {
        this.dialog.open(InfoComponent, { data:  state.error });
      }
    });

    const lab = this.route.snapshot.data.lab;
    if (lab) {
      this.mode = 'edit';
      this._id = lab._id;
      this.form.setValue({
            name: lab.name,
            email: lab.email,
            address: lab.address
          });
    } else {
      this._id = null;
      this.mode = 'create';
    }
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
  }

  onSaveLab() {
    if (this.form.invalid) {
      return;
    }
    this.loading.setLoading();
    if (this.mode === "create") {
      const lab: Lab = {...this.form.value, id: null };
      this.store.dispatch(LabActions.addLab({lab}));
    } else {
      const lab: Lab = { _id: this._id, ...this.form.value};
      this.store.dispatch(LabActions.updateLab({lab}));
    }
  }
}
