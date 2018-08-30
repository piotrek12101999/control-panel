import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  public files: Observable<Array<any>>;

  constructor(private _storage: AngularFireStorage) {
  }


  public downloadRepo(path: string, file: string): void {
    this._storage.ref(`${path}/${file}`).getDownloadURL().subscribe(link => {
      window.open(link);
    });
  }

  public deleteFile(collectionName: AngularFirestoreCollection, docName: string,
    path: string, nameStorage: string, nameFirestore: string): void {
    swal({
      title: 'Are you sure?',
      text: 'You wiil not be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00d1b1',
      cancelButtonColor: '#fe385f',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        collectionName.doc(docName).update({
          projectRepoFiles: firebase.firestore.FieldValue.arrayRemove(nameFirestore)
        });
        this._storage.ref(`${path}/${nameStorage}`).delete();
        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  }
}
