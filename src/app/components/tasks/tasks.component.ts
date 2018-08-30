import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/task-service/task.service';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  public taskName: FormControl = new FormControl(Validators.required);
  public taskDescription: FormControl = new FormControl(Validators.required);
  public taskProject: FormControl = new FormControl(Validators.required);
  public taskPriority: FormControl = new FormControl(Validators.required);

  constructor(public taskService: TaskService, public projectsService: ProjectsService, private _authService: AuthService,
    private _pageService: PageService) { }

  public cleanForm(): void {
    this.taskName.setValue(null);
    this.taskDescription.setValue(null);
    this.taskProject.setValue(null);
    this.taskPriority.setValue(null);
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.tasksSelected = true;
    this._pageService.homeSelected = false;
    this.taskName.setValue(null);
    this.taskDescription.setValue(null);
    this.taskProject.setValue(null);
    this.taskPriority.setValue(null);
  }

  ngOnDestroy() {
    this._pageService.tasksSelected = false;
    this._pageService.checkChange();
  }

}
