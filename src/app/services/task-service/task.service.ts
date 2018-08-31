import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { ProjectsService } from '../projects-service/projects.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { TaskData } from '../../models/task.model';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public tasksCollection: AngularFirestoreCollection<TaskData>;
  public tasks: Observable<TaskData[]>;

  public selectedProjectMajorTasksCollection: AngularFirestoreCollection<TaskData>;
  public selctedProjectMajorTasks: Observable<TaskData[]>;
  public selectedProjectImportantTasksCollection: AngularFirestoreCollection<TaskData>;
  public selctedProjectImportantTasks: Observable<TaskData[]>;
  public selectedProjectNormalTasksCollection: AngularFirestoreCollection<TaskData>;
  public selctedProjectNormalTasks: Observable<TaskData[]>;
  public selectedProjectLowTasksCollection: AngularFirestoreCollection<TaskData>;
  public selctedProjectLowTasks: Observable<TaskData[]>;
  public selectedProjectSmallTasksCollection: AngularFirestoreCollection<TaskData>;
  public selctedProjectSmallTasks: Observable<TaskData[]>;

  public toDoTasksCollection: AngularFirestoreCollection<TaskData>;
  public toDoTasks: Observable<TaskData[]>;
  public inProgressTasksCollection: AngularFirestoreCollection<TaskData>;
  public inProgressTasks: Observable<TaskData[]>;
  public codeReviewTasksCollection: AngularFirestoreCollection<TaskData>;
  public codeReviewTasks: Observable<TaskData[]>;
  public doneTasksCollection: AngularFirestoreCollection<TaskData>;
  public doneTasks: Observable<TaskData[]>;

  public selectedTask: AngularFirestoreDocument<any>;
  public selectedTaskName: Observable<string>;
  public selectedTaskDesc: Observable<string>;
  public selectedTaskProjectID: Observable<string>;
  public selectedTaskProjectName: Observable<string>;
  public selectedTaskProjectType: Observable<string>;
  public selectedTaskStatus: Observable<string>;
  public selectedTaskPriority: Observable<string>;
  public selectedTaskDone: Observable<boolean>;
  public selectedTaskNotes: Observable<Array<string>>;
  public selectedTaskID: Observable<string>;

  public previousPage: string;

  constructor(private _afs: AngularFirestore, private _authService: AuthService, public _projectsService: ProjectsService) {
    this._authService.user.subscribe(data => {
      this.tasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.orderBy('taskName', 'asc');
      });
      this.tasks = this.tasksCollection.valueChanges();

      this.toDoTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskStatus', '==', 'To do');
      });
      this.toDoTasks = this.toDoTasksCollection.valueChanges();

      this.inProgressTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskStatus', '==', 'In progress');
      });
      this.inProgressTasks = this.inProgressTasksCollection.valueChanges();

      this.codeReviewTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskStatus', '==', 'Code review');
      });
      this.codeReviewTasks = this.codeReviewTasksCollection.valueChanges();

      this.doneTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskStatus', '==', 'Done');
      });
      this.doneTasks = this.doneTasksCollection.valueChanges();

    });
  }

  public selectProject(id: string): void {
    this._authService.user.subscribe(data => {
      this.selectedProjectMajorTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskAssignedToProject', '==', id).where('taskPriority', '==', 'major');
      });
      this.selctedProjectMajorTasks = this.selectedProjectMajorTasksCollection.valueChanges();

      this.selectedProjectImportantTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskAssignedToProject', '==', id).where('taskPriority', '==', 'important');
      });
      this.selctedProjectImportantTasks = this.selectedProjectImportantTasksCollection.valueChanges();

      this.selectedProjectNormalTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskAssignedToProject', '==', id).where('taskPriority', '==', 'normal');
      });
      this.selctedProjectNormalTasks = this.selectedProjectNormalTasksCollection.valueChanges();

      this.selectedProjectLowTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskAssignedToProject', '==', id).where('taskPriority', '==', 'low');
      });
      this.selctedProjectLowTasks = this.selectedProjectLowTasksCollection.valueChanges();

      this.selectedProjectSmallTasksCollection = this._afs.collection('users').doc(data.uid).collection('tasks', ref => {
        return ref.where('taskAssignedToProject', '==', id).where('taskPriority', '==', 'small');
      });
      this.selctedProjectSmallTasks = this.selectedProjectSmallTasksCollection.valueChanges();
    });
  }

  public editTask(name: string, desc: string, status: string,
    priority: string, projectInfo: any, done: boolean, oldProjectID: string): void {
    if (projectInfo.length > 3) {
      projectInfo = projectInfo.split(',');
    }
    this.selectedTask.update({
      taskName: name,
      taskDescription: desc,
      taskStatus: status,
      taskPriority: priority,
      taskAssignedToProject: projectInfo[0],
      taskAssignedToProjectName: projectInfo[1],
      taskAssignedToProjectType: projectInfo[2],
      taskDone: done
    });
    this._projectsService.projectsCollection.doc(oldProjectID).update({
      projectTasks: firebase.firestore.FieldValue.arrayRemove({
        taskName: this.selectedTaskName,
        taskID: this.selectedTaskID
      })
    });
    this._projectsService.projectsCollection.doc(projectInfo[0]).update({
      projectTasks: firebase.firestore.FieldValue.arrayUnion({
        taskName: name,
        taskID: this.selectedTaskID
      })
    });
  }

  public editTasksProjectValues(tasks: any, newName: string, newType: string): void {
    for (let i = 0; i < tasks.length; i++) {
      this.tasksCollection.doc(tasks[i].taskID).update({
        taskAssignedToProjectName: newName,
        taskAssignedToProjectType: newType
      });
    }
  }

  public selectTask(id: any, page: string) {
    this._authService.user.subscribe(val => {
      this.selectedTask = this._afs.collection('users').doc(val.uid).collection('tasks').doc(id);
      this.selectedTask.valueChanges().subscribe(data => {
        this.selectedTaskName = data.taskName;
        this.selectedTaskDesc = data.taskDescription;
        this.selectedTaskProjectID = data.taskAssignedToProject;
        this.selectedTaskProjectName = data.taskAssignedToProjectName;
        this.selectedTaskProjectType = data.taskAssignedToProjectType;
        this.selectedTaskStatus = data.taskStatus;
        this.selectedTaskPriority = data.taskPriority;
        this.selectedTaskDone = data.taskDone;
        this.selectedTaskNotes = data.taskNotes;
        this.selectedTaskID = id;
      });
    });
    if (page === 'tasks') {
      this.previousPage = `/${page}`;
    } else if (page === 'project') {
      this.previousPage = `/${page}`;
    }
  }

  public deleteTask(tasks: Array<any>): void {
    for (let i = 0; i < tasks.length; i++) {
      this.tasksCollection.doc(tasks[i].taskID).delete();
    }
  }

  public addTask(name: string, description: string, projectInfo: any, priority: string): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    projectInfo = projectInfo.split(',');
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.tasksCollection.doc(autoId).set({
      taskName: name,
      taskDescription: description,
      taskAssignedToProject: projectInfo[0],
      taskAssignedToProjectName: projectInfo[1],
      taskAssignedToProjectType: projectInfo[2],
      taskStatus: 'To do',
      taskDone: false,
      taskPriority: priority,
      taskNotes: [],
      taskID: autoId
    });
    this._projectsService.projectsCollection.doc(projectInfo[0]).update({
      projectTasks: firebase.firestore.FieldValue.arrayUnion({
        taskName: name,
        taskID: autoId
      })
    });
  }

  public deleteSpecificTask(id: string, name: string, projectID: string): void {
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
        this.tasksCollection.doc(id).delete();
        this._projectsService.projectsCollection.doc(projectID).update({
          projectTasks: firebase.firestore.FieldValue.arrayRemove({
            taskID: id,
            taskName: name
          })
        });
        swal(
          'Deleted!',
          'Task has been deleted!',
          'success'
        );
      }
    });
  }

  public dragToToDo(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskStatus: 'To do'
    });
  }

  public dragToInProgress(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskStatus: 'In progress'
    });
  }

  public dragToCodeReview(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskStatus: 'Code review'
    });
  }

  public dragToDone(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskStatus: 'Done'
    });
  }

  public dragToMajor(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskPriority: 'major'
    });
  }

  public dragToImportant(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskPriority: 'important'
    });
  }

  public dragToNormal(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskPriority: 'normal'
    });
  }

  public dragToLow(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskPriority: 'low'
    });
  }

  public dragToSmall(e: any): void {
    this.tasksCollection.doc(e.dragData.taskID).update({
      taskPriority: 'small'
    });
  }

  public addNote(id: string, noteDesc: string): void {
    this.tasksCollection.doc(id).update({
      taskNotes: firebase.firestore.FieldValue.arrayUnion({
        note: noteDesc
      })
    });
  }

  public deleteNote(id: string, noteToDelete: string): void {
    this.tasksCollection.doc(id).update({
      taskNotes: firebase.firestore.FieldValue.arrayRemove({
        note: noteToDelete
      })
    });
  }
}
