import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects-service/projects.service';
import { FileService } from '../../services/file-service/file.service';
import { TaskService } from '../../services/task-service/task.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { PageService } from '../../services/page-service/page.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  public startEditingProject: boolean;
  public editedProjectName: FormControl = new FormControl(Validators.required);
  public editedProjectDescription: FormControl = new FormControl(Validators.required);
  public editedProjectKey: FormControl = new FormControl(Validators.required);
  public editedProjectType: FormControl = new FormControl(Validators.required);
  public editedProjectDate: FormControl = new FormControl(Validators.required);
  public projectTypeValues: Array<any> = [
    { value: 'WebDev', name: 'Web Development' },
    { value: 'School', name: 'School' },
    { value: 'GameDev', name: 'Game Development' },
    { value: 'Home', name: 'Home' },
    { value: 'Tutorials', name: 'Tutorials' }
  ];

  constructor(public projectsService: ProjectsService, public fileService: FileService, public taskService: TaskService
    , private _authService: AuthService, private _pageService: PageService) { }

  public editProject(): void {
    this.startEditingProject = true;
    this.editedProjectName.setValue(this.projectsService.selectedProjectName);
    this.editedProjectDescription.setValue(this.projectsService.selectedProjectDesc);
    this.editedProjectKey.setValue(this.projectsService.selectedProjectKey);
    this.editedProjectType.setValue(this.projectsService.selectedProjectType);
    if (this.projectsService.selectedProjectDay === undefined) {
      this.editedProjectDate.setValue('0000-00-00');
    } else {
     this.editedProjectDate.setValue
     (`${new Date().getFullYear()}-0${this.projectsService.selectedProjectMonth}-${this.projectsService.selectedProjectDay}`);
    }
  }

  public endEditProject(): void {
    this.startEditingProject = false;
  }

  ngOnInit() {
    this._authService.hideLoginComponent();
    this.startEditingProject = false;
    this._pageService.projectsSelected = true;
    this._pageService.showProjectsSubcategory = true;
    this._pageService.homeSelected = false;
  }

  ngOnDestroy() {
    this._pageService.projectsSelected = false;
    this._pageService.showProjectsSubcategory = false;
    this._pageService.checkChange();
  }

}
