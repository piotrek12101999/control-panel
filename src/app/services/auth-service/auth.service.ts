import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { UserData } from '../../models/user.model';

@Injectable()
export class AuthService {

  public user: Observable<UserData>;
  public showLoginComponent: boolean;

  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.showLoginComponent = true;
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<UserData>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public hideLoginComponent(): void {
    this.showLoginComponent = false;
  }

  public googleLogin(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    return this._oAuthLogin(provider);
  }

  private _oAuthLogin(provider: auth.GoogleAuthProvider): Promise<void> {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this._updateUserData(credential.user);
      });
  }

  private _updateUserData(user: UserData): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });

  }

  public signOut(): void {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['']);
      this.showLoginComponent = true;
    });
  }
}
