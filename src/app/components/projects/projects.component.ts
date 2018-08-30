import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import { TaskService } from '../../services/task-service/task.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  public projectName: FormControl = new FormControl(Validators.required);
  public projectDescription: FormControl = new FormControl(Validators.required);
  public projectKey: FormControl = new FormControl(Validators.required);
  public projectType: FormControl = new FormControl(Validators.required);
  public projectDeadline: FormControl = new FormControl();
  public projectTypeValues: Array<any> = [
    { value: 'WebDev' , name: 'Web Development' },
    { value: 'School', name: 'School' },
    { value: 'GameDev', name: 'Game Development' },
    { value: 'Home', name: 'Home' },
    { value: 'Tutorials', name: 'Tutorials'}
  ];

  constructor(public projectsService: ProjectsService, public userData: UserDataService, public taskService: TaskService,
  private _authService: AuthService, private _pageService: PageService) { }

  public cleanForm(): void {
    this.projectName.setValue(undefined);
    this.projectDescription.setValue(undefined);
    this.projectKey.setValue(undefined);
    this.projectType.setValue(undefined);
    this.projectDeadline.setValue(undefined);
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this._pageService.projectsSelected = true;
    this._pageService.homeSelected = false;
    this.projectName.setValue(undefined);
    this.projectDescription.setValue(undefined);
    this.projectKey.setValue(undefined);
    this.projectType.setValue(undefined);
    this.projectDeadline.setValue(undefined);
  }

  ngOnDestroy() {
    this._pageService.projectsSelected = false;
    this._pageService.checkChange();
  }

}
