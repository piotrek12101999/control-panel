import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { ProjectData } from '../../models/project.model';
import { CalendarService } from '../calendar-service/calendar.service';
import { FileService } from '../file-service/file.service';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private _projectsStoragePath: string;
  public projectsCollection: AngularFirestoreCollection<ProjectData>;
  public projects: Observable<ProjectData[]>;
  public selectedProject: AngularFirestoreDocument<any>;
  public selectedProjectName: Observable<string>;
  public selectedProjectDesc: Observable<string>;
  public selectedProjectKey: Observable<string>;
  public selectedProjectType: Observable<string>;
  public selectedProjectTasks: Observable<Array<any>>;
  public selectedProjectDay: Observable<number>;
  public selectedProjectMonth: Observable<number>;
  public selectedRepoPath: Observable<string>;
  public selectedRepoFiles: Observable<Array<any>>;
  public selectedRepoFilesLength: Observable<number>;
  public selectedProjectID: Observable<string>;
  public hasRepo: boolean;
  public hasTasks: boolean;
  public previousPage: string;

  constructor(private _afs: AngularFirestore, private _authService: AuthService,
    private _storage: AngularFireStorage, private _fileService: FileService, private _calendarService: CalendarService) {
    this._authService.user.subscribe(val => {
      this.projectsCollection = this._afs.collection('users').doc(val.uid).collection('projects', ref => {
        return ref.orderBy('projectName', 'asc');
      });
      this.projects = this.projectsCollection.valueChanges();
      this._projectsStoragePath = `${val.uid}/projects`;
    });
  }

  public addProject(name: string, description: string, key: string, type: string, date: string): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this._authService.user.subscribe(data => {
      this.projectsCollection.doc(autoId).set({
        projectName: name,
        projectDescription: description,
        projectKey: key,
        projectType: type,
        projectTasks: [],
        projectRepoPath: `${data.uid}/projects/${name}`,
        projectRepoFiles: [],
        projectID: autoId
      });
      if (date !== undefined) {
        const day = date.substring(8, 10);
        const month = date.charAt(6);
        this.projectsCollection.doc(autoId).update({
          projectDay: day,
          projectMonth: +month
        });
        this._calendarService.addCalendarEvent(date, name, description, type, autoId);
      }
    });
  }

  public deleteProject(id: string, files: Array<any>, projectsStoragePath: string): void {
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
        for (let i = 0; i < files.length; i++) {
          this._storage.ref(`${projectsStoragePath}/${files[i].fileName}`).delete();
        }
        this.projectsCollection.doc(id).delete();
        this._calendarService.deleteEvent(id);
        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  }

  public selectProject(id: any, previousPage: string): void {
    this._authService.user.subscribe(val => {
      this.selectedProject = this._afs.collection('users').doc(val.uid).collection('projects').doc(id);
      this.selectedProject.valueChanges().subscribe(data => {
        this.selectedProjectName = data.projectName;
        this.selectedProjectDesc = data.projectDescription;
        this.selectedProjectKey = data.projectKey;
        this.selectedProjectType = data.projectType;
        this.selectedProjectTasks = data.projectTasks;
        this.selectedRepoPath = data.projectRepoPath;
        this.selectedRepoFiles = data.projectRepoFiles;
        this.selectedRepoFilesLength = data.projectRepoFiles.length;
        this.selectedProjectDay = data.projectDay;
        this.selectedProjectMonth = data.projectMonth;
        this.selectedProjectID = id;
        this._fileService.files = this.selectedRepoFiles;
        if (data.projectRepoFiles.length > 0) {
          this.hasRepo = true;
        } else {
          this.hasRepo = false;
        }
        if (data.projectTasks.length > 0) {
          this.hasTasks = true;
        } else {
          this.hasTasks = false;
        }
      });
    });
    this.previousPage = `/${previousPage}`;
  }

  public editProject(name: string, description: string, key: string, type: string, date: string, id: string): void {
    this.selectedProject.update({
      projectName: name,
      projectDescription: description,
      projectKey: key,
      projectType: type,
    });
    if (date !== undefined) {
      const day = date.substring(8, 10);
      const month = date.charAt(6);
      this.selectedProject.update({
        projectDay: day,
        projectMonth: +month
      });
      this._calendarService.addCalendarEvent(date, name, description, type, id);
    } else {
      this.selectedProject.update({
        projectDay: '0',
        projectMonth: 0
      });
      this._calendarService.deleteEvent(id);
    }
  }
}
