import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { GroupService } from '../group-service/group.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  public userInvitations;
  public invitationsCount: number;
  public showEmailWarning: boolean;

  constructor(private _afs: AngularFirestore, private _authService: AuthService, private _groupService: GroupService) {
    this._authService.user.subscribe(data => {
      this.userInvitations = this._afs.collection('invitations', ref => {
        return ref.where('targetEmail', '==', data.email);
      }).valueChanges();
    });

    this._calculateNumberOfInvitations();
  }

  private _calculateNumberOfInvitations() {
    this._authService.user.subscribe(data => {
      this._afs.firestore.collection('invitations').where('targetEmail', '==', data.email).get().then(snap => {
        this.invitationsCount = snap.size;
      });
    });
  }

  public sendInvitation(groupInfo: any, targetEmail: string, targetRights: string): void {
    groupInfo = groupInfo.split(',');
    this._authService.user.subscribe(data => {
      if (targetEmail === data.email) {
        this.showEmailWarning = true;
      } else {
        this.showEmailWarning = false;
      }
    });
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (this.showEmailWarning === false) {
      this._afs.collection('invitations').doc(autoId).set({
        groupID: groupInfo[0],
        groupName: groupInfo[1],
        targetEmail: targetEmail,
        targetRights: targetRights,
        invitationID: autoId
      });
      this._calculateNumberOfInvitations();
    }
  }

  public acceptInvitation(invitationID: string, groupID: string, userRights: string) {
    this._authService.user.subscribe(data => {
      this._groupService.addUser(groupID, data.uid, data.email, data.displayName, data.photoURL, userRights);
      this._afs.collection('invitations').doc(invitationID).delete();
      this._calculateNumberOfInvitations();
    });
  }

  public deleteInvitation(invitationID: string) {
    this._afs.collection('invitations').doc(invitationID).delete();
    this._calculateNumberOfInvitations();
  }
}
