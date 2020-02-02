import { Component, OnInit, Inject } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { FilesService } from '../../_services/files.service';
import { environment } from '../../../environments/environment';
import { Subscription, of } from 'rxjs';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { tap, last, catchError, finalize, take, map } from 'rxjs/operators';
import { FileUpload, Examination, User } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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

  private exam: Examination;
  private user: User;

  constructor(private readonly fileService: FilesService,
              private readonly dialogRef: MatDialogRef<FileUploadComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: any) {}

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

    this.fileService.getFileUrl().pipe(take(1)).subscribe(
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
                console.log('error', error)
                return of(`${file.data.name} upload failed - error ${error}`);
          }),
          finalize(() => {
            file.sub.unsubscribe();
            this.file_to_upload = null;
            this.dialogRef.close();
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
                result => console.log('fileupload success', result),
                err => console.log('fileupload failed', err)
              )
            }
          },
          err => console.log('error', err)
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
