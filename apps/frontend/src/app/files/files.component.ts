import { Component, OnInit } from '@angular/core';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { tap, last, catchError, map, finalize, scan, take } from 'rxjs/operators';
import { FilesService } from '../_services/files.service';
import { FileUpload } from '../_models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'zabek-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(300, style({ opacity: 0 }))
          ])
    ])
]
})
export class FilesComponent implements OnInit {

  text = 'Upload file to S3';
  accept = environment.s3AcceptFileTypes;

  file_to_upload: FileUploadModel;
  files = new BehaviorSubject<FileUpload[]>([]);
  files$ = this.files.asObservable().pipe(
    scan((acc, curr) => {
      return [...acc, ...curr];
    }, <FileUpload[]>[])
  );

  constructor(private readonly fileService: FilesService) {}
  
  ngOnInit(): void {
    this.fileService.getAllFiles().pipe(
      take(1)
    ).subscribe(
      result => this.files.next(result),
      err => console.log('error', err)
    );
  }

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

  private uploadFile(file: FileUploadModel) {    

    this.fileService.getFileUrl().subscribe(
      res => {
        file.inProgress = true;
        const fileDisplay: FileUpload = { 
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
          })
        )
        .subscribe(
          event => {
            if (event.type === HttpEventType.Response) {
                this.files.next([fileDisplay]);
                this.fileService.addFileUpload(fileDisplay).pipe(
                  take(1)
                ).subscribe(
                  result => console.log('fileupload success'),
                  err => console.log('fileupload failed')
                )
            }
          },
          err => console.log('error', err)
        );
      }
    );
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

  openLink(link: string) {
    window.open(environment.s3BucketAddress+link, "_blank");
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
