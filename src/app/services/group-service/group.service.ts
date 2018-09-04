import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { GroupData } from '../../models/group.model';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private _groupsCollection: AngularFirestoreCollection<GroupData>;
  private _userGroupsRead: AngularFirestoreCollection<GroupData>;
  private _userGroupsReadWrite: AngularFirestoreCollection<GroupData>;
  private _adminGroups: AngularFirestoreCollection<GroupData>;
  public userGroupsRead: Observable<GroupData[]>;
  public userGroupsReadWrite: Observable<GroupData[]>;
  public adminGroups: Observable<GroupData[]>;
  public hasAdminGroups: boolean;
  public hasUserGroups: number;

  public selectedGroup: AngularFirestoreDocument<GroupData>;
  public selectedGroupName: string;
  public selectedGroupDesc: string;
  public selectedGroupAdmin;
  public selectedGroupMembers: Array<string>;
  public selectedGroupRepos: Array<any>;
  public selectedGroupID: string;

  constructor(private _afs: AngularFirestore, private _authService: AuthService) {
    this._groupsCollection = this._afs.collection('groups');

    this._authService.user.subscribe(data => {

      this._userGroupsRead = this._afs.collection('groups', ref => {
        return ref.where('groupMembers', 'array-contains', {
          userID: data.uid,
          userEmail: data.email,
          userName: data.displayName,
          userPicture: data.photoURL,
          userAccess: 'Read'
        });
      });

      this._userGroupsReadWrite = this._afs.collection('groups', ref => {
        return ref.where('groupMembers', 'array-contains', {
          userID: data.uid,
          userEmail: data.email,
          userName: data.displayName,
          userPicture: data.photoURL,
          userAccess: 'Read and write'
        });
      });

      this._adminGroups = this._afs.collection('groups', ref => {
        return ref.where('groupAdmin', '==', {
          userID: data.uid,
          userEmail: data.email,
          userName: data.displayName,
          userPicture: data.photoURL
        });
      });

      this.userGroupsRead = this._userGroupsRead.valueChanges();
      this.userGroupsReadWrite = this._userGroupsReadWrite.valueChanges();
      this.adminGroups = this._adminGroups.valueChanges();
    });
  }

  public addGroup(name: string, desc: string): void {
    this._authService.user.subscribe(data => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let autoId = '';
      for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this._groupsCollection.doc(autoId).set({
        groupName: name,
        groupDesc: desc,
        groupAdmin: {
          userID: data.uid,
          userEmail: data.email,
          userName: data.displayName,
          userPicture: data.photoURL
        },
        groupMembers: [],
        groupRepos: [],
        groupID: autoId
      });
    });
  }

  public addUser(groupID: string, userID: string, userEmail: string, userName: string, userPicture: string, userRights: string): void {
    this._groupsCollection.doc(groupID).update({
      groupMembers: firebase.firestore.FieldValue.arrayUnion({
        userID: userID,
        userEmail: userEmail,
        userName: userName,
        userPicture: userPicture,
        userAccess: userRights
      })
    });
  }

  public deleteUser(groupID: string, userID: string, userEmail: string, userName: string, userPicture: string, userRights: string): void {
    this._groupsCollection.doc(groupID).update({
      groupMembers: firebase.firestore.FieldValue.arrayRemove({
        userID: userID,
        userEmail: userEmail,
        userName: userName,
        userPicture: userPicture,
        userAccess: userRights
      })
    });
  }

  public deleteGroup(groupID: string): void {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00d1b1',
      cancelButtonColor: '#fe385f',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this._groupsCollection.doc(groupID).delete();
        swal(
          'Deleted!',
          'Group has been deleted.',
          'success'
        );
      }
    });
  }

  public selectGroup(groupID: string): void {
    this.selectedGroup = this._afs.collection('groups').doc(groupID);
    this.selectedGroup.valueChanges().subscribe( data => {
      this.selectedGroupName = data.groupName;
      this.selectedGroupDesc = data.groupDesc;
      this.selectedGroupAdmin = data.groupAdmin;
      this.selectedGroupMembers = data.groupMembers;
      this.selectedGroupRepos = data.groupRepos;
      this.selectedGroupID = groupID;
    });
  }
}
