import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { scan, take } from 'rxjs/operators';
import { FilesService } from '../_services/files.service';
import { FileUpload } from '@zabek/data';
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
      err => console.log('get all files error', err)
    );
  }

  openLink(link: string) {
    window.open(environment.s3BucketAddress+link, "_blank");
  }
}


