import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FileUploadModel } from '../files/files.component';
import { FileUpload } from '@zabek/data';

const BACKEND_URL = environment.apiUrl + '/api/files';

@Injectable({ providedIn: 'root' })
export class FilesService {

  constructor(private readonly http: HttpClient ) {}

  getFileUrl(): Observable<{url: string, key: string}> {
    return this.http.get<{url: string, key: string}>(BACKEND_URL+'/fileupload');
  }

  putFile(url, file: FileUploadModel) {
    return this.http.put(url, file.data, { reportProgress: true, observe: 'events', responseType: "json" });
  }

  getAllFiles(): Observable<FileUpload[]> {
    return this.http.get<FileUpload[]>(BACKEND_URL);
  }

  addFileUpload(fileUpload: FileUpload) {
    return this.http.post(BACKEND_URL, fileUpload);
  }
}
