import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import * as firebase from 'firebase';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  public task: AngularFireUploadTask;
  public percentage: Observable<number>;
  public snapshot: Observable<any>;
  public downloadURL: Observable<string>;
  public isUploading: boolean;

  constructor(private _storage: AngularFireStorage, private _projectService: ProjectsService) { }

  startUpload(event: FileList): void {
    this.isUploading = true;
    const file = event.item(0);
    const path = `${this._projectService.selectedRepoPath}/${file.name}`;
    const customMetadata = { projectID: `${this._projectService.selectedProjectID}` };
    this.task = this._storage.upload(path, file, { customMetadata });
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();
    this.snapshot.pipe(finalize(() => this.downloadURL = this._storage.ref(path).getDownloadURL())).subscribe();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          this._projectService.projectsCollection.doc(`${this._projectService.selectedProjectID}`).update({
            projectRepoFiles: firebase.firestore.FieldValue.arrayUnion({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            })
          });
          setTimeout(() => { this.isUploading = false; }, 1000);
        }
      })
    );
  }
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  stopDisplayingInfo(): void {
    this.isUploading = false;
  }


  ngOnInit() {
    this.isUploading = false;
  }

}
