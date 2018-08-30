import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/task-service/task.service';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  public editTaskName: FormControl = new FormControl(Validators.required);
  public editTaskDesc: FormControl = new FormControl(Validators.required);
  public editTaskStatus: FormControl = new FormControl(Validators.required);
  public editTaskPriority: FormControl = new FormControl(Validators.required);
  public editTaskAssignedToProject: FormControl = new FormControl(Validators.required);
  public editTaskDone: FormControl = new FormControl(Validators.required);
  public noteDesc: FormControl = new FormControl(Validators.required);
  public startEditing: boolean;
  public addingNote: boolean;

  constructor(public taskService: TaskService, public projectsService: ProjectsService, private _authService: AuthService,
  private _pageService: PageService) { }

  public editStart() {
    this.startEditing = true;
    this.editTaskName.setValue(this.taskService.selectedTaskName);
    this.editTaskDesc.setValue(this.taskService.selectedTaskDesc);
    this.editTaskStatus.setValue(this.taskService.selectedTaskStatus);
    this.editTaskPriority.setValue(this.taskService.selectedTaskPriority);
    this.editTaskAssignedToProject.setValue([this.taskService.selectedTaskProjectID,
      this.taskService.selectedTaskProjectName, this.taskService.selectedTaskProjectType]);
    this.editTaskDone.setValue(this.taskService.selectedTaskDone);
  }

  public editEnd(): void {
    this.startEditing = false;
  }

  public startAddingNote(): void {
    this.addingNote = true;
    this.noteDesc.setValue(null);
  }

  public endAddingNote(): void {
    this.addingNote = false;
    this.noteDesc.setValue(null);
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.tasksSelected = true;
    this._pageService.homeSelected = false;
    this.startEditing = false;
    this.addingNote = false;
  }

  ngOnDestroy() {
    this._pageService.tasksSelected = false;
    this._pageService.checkChange();
  }

}
