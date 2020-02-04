import { Component, Inject } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { FilesService } from '../../_services/files.service';
import { environment } from '../../../environments/environment';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { tap, last, catchError, finalize, take, map } from 'rxjs/operators';
import { FileUpload } from '@zabek/data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppState, AppActions } from '../../store';

@Component({
  selector: 'zabek-fileupload',
  templateUrl: './fileupload.component.html',
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(300, style({ opacity: 0 }))
          ])
    ])
]
})
export class FileUploadComponent {

  text = 'Dołącz plik do badania'
  accept = environment.s3AcceptFileTypes;
  file_to_upload: FileUploadModel;

  private cantClose = new BehaviorSubject<boolean>(false);
  cantClose$ = this.cantClose.asObservable();

  constructor(private readonly fileService: FilesService,
              private readonly dialogRef: MatDialogRef<FileUploadComponent>,
              private readonly store: Store<AppState>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any,) {}

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
          for (let index = 0; index < fileUpload.files.length; index++) {
                const file = fileUpload.files[index];
                this.file_to_upload = { data: file, state: 'in', 
                inProgress: false, progress: 0, canRetry: false, canCancel: true };
          }
          this.upload();
    };
    fileUpload.click();
  }

  private upload() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';
    this.uploadFile(this.file_to_upload);
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.file_to_upload = null;
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
  }

  private uploadFile(file: FileUploadModel) {   

    this.cantClose.next(true);
    this.fileService.getFileUrl().pipe(
        take(1),
        finalize(() => this.cantClose.next(false))
      )
      .subscribe(
        res => {
          file.inProgress = true;

          const fileDisplay: FileUpload = {
            exam: this.data.exam,
            user: this.data.user,
            _id: null,
            name: file.data.name, 
            key: res.key, 
            size: Number((file.data.size / 1024).toFixed(2)) };
          file.sub = this.fileService.putFile(res.url, file).pipe(
            map((event : any)=> {
                  switch (event.type) {
                        case HttpEventType.UploadProgress:
                              file.progress = Math.round(event.loaded * 100 / event.total);
                              break;
                        case HttpEventType.Response:
                              return event;
                  }
            }),
            tap(message => { }),
            last(),
            catchError((error: HttpErrorResponse) => {
                  file.inProgress = false;
                  file.canRetry = true;
                  this.store.dispatch(AppActions.raiseError({message: `Zapisanie pliku ${file.data.name} nie powiodło się` , status: error.statusText}))
                  return of(`${file.data.name} upload failed - error ${error}`);
            }),
            finalize(() => {
              file.sub.unsubscribe();
              this.file_to_upload = null;
              this.cantClose.next(false);
            })
          )
          .subscribe(
            event => {
              if (event.type === HttpEventType.Response) {
                this.fileService.addFileUpload(fileDisplay).pipe(
                  take(1),
                  catchError(err => { console.log('error', err);
                            return of(`${file.data.name} upload failed - error ${err}`);}),
                  finalize(() => this.dialogRef.close())
                ).subscribe(
                  result => this.store.dispatch(AppActions.sendInfo({info: 'Plik został dodany.'})),
                  err => this.store.dispatch(AppActions.raiseError({message: 'Bład podczas zapisyawnia pliku', status: null}))
                )
              }
            },
            err => this.store.dispatch(AppActions.raiseError({message: 'Błąd podczas zapisywania pliku w chmurze', status: null}))
          );
        }
      );
  }

}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
